import { Span } from '@opentelemetry/api';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import {
  combineLatest,
  debounceTime,
  defer,
  distinctUntilChanged,
  map,
  switchMap,
} from 'rxjs';

import { PlatformService } from '@shared/infrastructure';
import { SitePostService } from '../site-common/site-post.service';
import { WebsiteTheme } from '@features/layout/domain';
import { faro } from '@grafana/faro-web-sdk';

@Component({
  selector: 'app-layout-toolbar',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    MatToolbarModule,
    MatIconModule,
    MatInputModule,
    MatAutocompleteModule,
    MatButtonModule,
  ],
  template: ` <mat-toolbar
    color="primary"
    class="toolbar mat-elevation-z6 fixed z-10"
    xmlns="http://www.w3.org/1999/html"
  >
    <!-- menu toggle button -->
    <button
      role="button"
      aria-label="打開/收合選單"
      mat-icon-button
      (click)="toggleMenu()"
    >
      @if (menuOpen()) {
        <mat-icon>menu_open</mat-icon>
      }
      @if (!menuOpen()) {
        <mat-icon>menu</mat-icon>
      }
    </button>

    <!-- title -->
    <h1>
      <a
        class="header-link no-underline text-[color:var(--header-link-color)] hover:text-[color:var(--header-link-color)] hover:no-underline active:text-[color:var(--header-link-color)]"
        routerLink="/"
        (click)="goHome()"
      >
        <span class="header-link text-2xl">全端開發人員天梯</span>
      </a>
    </h1>

    <div class="grow"></div>

    <!-- toggle theme button -->
    @if (!isServer) {
      <button
        role="button"
        aria-label="深色/亮色模式"
        mat-icon-button
        class="mr-2"
        (click)="toggleTheme()"
      >
        @if (theme() === 'light') {
          <mat-icon>light_mode</mat-icon>
        } @else {
          <mat-icon>dark_mode</mat-icon>
        }
      </button>
    }

    <!-- search input -->
    @if (!isSmallScreen()) {
      <div class="search-bar">
        <input
          autocomplete="off"
          type="text"
          class="search-input h-9 rounded-md w-60 text-[16px] border-0 p-2 hidden md:block"
          matInput
          accesskey="/"
          placeholder="搜尋... ( Alt + / )"
          #input
          (keyup.enter)="
            searchKeywordChange.emit(searchKeyword.value || '');
            input.blur();
            trigger.closePanel();
            auto._isOpen = false
          "
          (input)="keepSearchKeyword.set(searchKeyword.value || '')"
          [formControl]="searchKeyword"
          [matAutocomplete]="auto"
          #trigger="matAutocompleteTrigger"
        />
        <mat-autocomplete
          #auto="matAutocomplete"
          panelWidth="auto"
          (optionSelected)="optionSelected($event)"
          (opened)="searchPanelOpened()"
          (closed)="searchPanelClosed()"
        >
          @for (item of suggestList(); track item.link) {
            <mat-option [value]="item">
              <span class="suggest-item-type">{{ item.type }}</span>
              <span class="suggest-item-text">{{ item.text }}</span>
            </mat-option>
          }
        </mat-autocomplete>
      </div>
    }
  </mat-toolbar>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutToolbarComponent {
  readonly menuOpen = input<boolean>(true);
  readonly menuOpenChange = output<boolean>();

  readonly theme = input<WebsiteTheme>('dark');
  readonly themeChange = output<WebsiteTheme>();

  readonly searchKeywordChange = output<string>();
  readonly selectSuggestItemChange = output<string>();

  private platformService = inject(PlatformService);
  private sitePostService = inject(SitePostService);

  protected isServer = this.platformService.isServer;
  protected isSmallScreen = this.platformService.isSmallScreen;
  protected searchKeyword = new FormControl<string>('');

  protected keepSearchKeyword = signal('');

  private suggestList$ = combineLatest([
    this.sitePostService.postsMetaWithSlugAndSortDesc$,
    this.searchKeyword.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
    ),
  ]).pipe(
    switchMap(([posts, keywordString]) =>
      defer(() =>
        import('@features/search/domain').then((m) => m.searchPosts),
      ).pipe(map((searchFn) => searchFn(posts, keywordString || ''))),
    ),
  );
  protected suggestList = toSignal(this.suggestList$);

  protected span?: Span;
  protected originalView?: string;

  protected toggleMenu() {
    this.menuOpenChange.emit(!this.menuOpen());
    faro.api.pushEvent('menu-toggle', {
      menuOpen: !this.menuOpen() ? 'Y' : 'N',
      theme: this.theme() === 'light' ? 'dark' : 'light',
    });
  }

  protected toggleTheme() {
    this.themeChange.emit(this.theme() === 'light' ? 'dark' : 'light');
    faro.api.pushEvent('theme-toggle', {
      theme: this.theme() === 'light' ? 'dark' : 'light',
    });
  }

  protected optionSelected(
    event: MatAutocompleteSelectedEvent,
  ) {
    faro.api.pushEvent('suggest-item-selected', {
      keyword: this.keepSearchKeyword(),
      link: event.option.value.link,
      type: event.option.value.type,
      title: event.option.value.text,
    });

    this.selectSuggestItemChange.emit(event.option.value.link);
    this.searchKeyword.setValue('');
  }

  protected searchPanelOpened() {
    this.originalView = faro.api.getView()?.name;
    faro.api.setView({ name: 'search-panel' });
    faro.api.pushEvent('search-panel-opened', {});
    const { trace, context } = faro.api.getOTEL() ?? {
      trace: null,
      context: null,
    };
    if (!trace || !context) {
      return;
    }
    const tracer = trace.getTracer('Toolbar');
    const span = tracer.startSpan('Open Search Panel');
    this.span = span;
  }

  protected searchPanelClosed() {
    faro.api.setView({ name: this.originalView ?? '' });
    faro.api.pushEvent('search-panel-closed', {});
    if (this.span) {
      this.span.setAttribute('search-keyword', this.keepSearchKeyword());
      this.span.end();
      this.span = undefined;
    }
  }

  protected goHome() {
    faro.api.pushEvent('go-home');
  }
}
