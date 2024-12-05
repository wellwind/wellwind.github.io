import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
  effect,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDrawerContent, MatSidenavModule } from '@angular/material/sidenav';
import {
  NavigationEnd,
  NavigationStart,
  Router,
  RouterOutlet,
} from '@angular/router';
import { PlatformService } from '../site-common/platform.service';
import { LayoutSidebarComponent } from './layout-sidebar.component';
import { LayoutToolbarComponent } from './layout-toolbar.component';
import { WebsiteTheme } from './website-theme';
import { filter, map } from 'rxjs';

@Component({
    selector: 'app-layout',
    template: `
    <app-layout-toolbar
      [menuOpen]="menuOpen()"
      (menuOpenChange)="menuOpen.set($event)"
      [theme]="theme()"
      (themeChange)="theme.set($event)"
      (selectSuggestItemChange)="selectSuggestItem($event)"
      (searchKeywordChange)="goSearchPage($event)"
    ></app-layout-toolbar>

    @if (pageLoading()) {
    <mat-progress-bar
      mode="indeterminate"
      color="accent"
      class="!fixed top-0 z-50"
    ></mat-progress-bar>
    }

    <mat-drawer-container
      class="drawer-container top-16 h-[calc(100vh - 64px)]"
    >
      <mat-drawer
        class="sidebar min-w-[240px] max-w-[240px]"
        [class.server-sidebar]="isServer"
        [mode]="isSmallScreen() ? 'over' : 'side'"
        [disableClose]="isSmallScreen() ? false : true"
        [opened]="menuOpen()"
        (closed)="menuOpen.set(false)"
      >
        <app-layout-sidebar></app-layout-sidebar>
      </mat-drawer>

      <mat-drawer-content
        class="main-content"
        [class.server]="isServer"
        #matDrawerContent
      >
        <router-outlet></router-outlet>
      </mat-drawer-content>
    </mat-drawer-container>
  `,
    styles: `
  .drawer-container {
  height: calc(100vh - 64px);
}

::ng-deep {
  .mat-drawer-inner-container {
    &::-webkit-scrollbar {
      height: 4px;
      width: 4px;
    }

    &::-webkit-scrollbar-thumb {
      background: rgba(0, 0, 0, 0.26);
    }
  }
}

.sidebar {
  @media (max-width: 959.98px) {
    min-width: 320px;
    max-width: 320px;
    &.server-sidebar {
      display: none;
    }
  }
}

.main-content.server {
  margin-left: 240px;
}

@media (max-width: 959.98px) {
  .main-content.server {
    margin-left: 0 !important;
  }
}
`,
    imports: [
        MatProgressBarModule,
        MatSidenavModule,
        RouterOutlet,
        LayoutToolbarComponent,
        LayoutSidebarComponent,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutComponent implements OnInit {
  @ViewChild('matDrawerContent') private matDrawerContent?: MatDrawerContent;

  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);
  private platformService = inject(PlatformService);

  protected get isServer() {
    return this.platformService.isServer;
  }

  protected menuOpen = signal(true);
  protected theme = signal<WebsiteTheme>('dark');

  protected isSmallScreen = this.platformService.isSmallScreen;

  searchKeyword = new FormControl<string>('');

  private pageLoading$ = this.router.events.pipe(
    filter(
      (event) =>
        event instanceof NavigationStart || event instanceof NavigationEnd
    ),
    map((event) => event instanceof NavigationStart)
  );
  protected pageLoading = toSignal(this.pageLoading$);

  private themeEffect = effect(() => {
    if (this.platformService.isServer) {
      return;
    }

    localStorage.setItem('theme', this.theme() || '');
    document.body.classList.remove('dark-theme');
    document.body.classList.remove('light-theme');
    document.body.classList.add(`${this.theme()}-theme`);
    this.cdr.detectChanges();
  });

  private smallScreenEffect = effect(() => {
    if (this.platformService.isServer) {
      return;
    }
    if (this.isSmallScreen()) {
      this.menuOpen.set(false);
    }
  }, { allowSignalWrites: true });

  ngOnInit() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationStart))
      .subscribe(() => {
        if (this.matDrawerContent) {
          this.matDrawerContent.scrollTo({ top: 0, left: 0 });
          this.cdr.detectChanges();
        }
      });

    this.setTheme();
    this.cdr.detectChanges();
  }

  protected async selectSuggestItem(link: string) {
    await this.router.navigateByUrl(link);
  }

  protected async goSearchPage(keyword: string) {
    if (keyword) {
      await this.router.navigate(['query'], {
        queryParams: { q: keyword },
      });
    }
  }

  protected setTheme() {
    if (this.platformService.isServer) {
      return;
    }

    const themeFromSetting = localStorage.getItem('theme') as WebsiteTheme;
    if (themeFromSetting) {
      this.theme.set(themeFromSetting);
    } else if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: light)').matches
    ) {
      this.theme.set('light');
    }
  }
}
