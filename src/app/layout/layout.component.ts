import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  MatAutocomplete,
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDrawerContent, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import {
  NavigationEnd,
  NavigationStart,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { RxPush } from '@rx-angular/template/push';
import { BehaviorSubject, combineLatest, defer } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  switchMap,
} from 'rxjs/operators';
import { PlatformService } from '../../platform.service';
import { SitePostService } from '../site-post.service';

type WebsiteTheme = 'dark' | 'light' | null;

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    NgIf,
    MatIconModule,
    RouterLink,
    MatInputModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    NgFor,
    MatOptionModule,
    MatProgressBarModule,
    MatSidenavModule,
    MatDividerModule,
    MatListModule,
    RouterLinkActive,
    RouterOutlet,
    RxPush,
  ],
})
export class LayoutComponent implements OnInit {
  @ViewChild('matDrawerContent') matDrawerContent?: MatDrawerContent;

  get isServer() {
    return this.platformService.isServer;
  }

  theme$ = new BehaviorSubject<WebsiteTheme>('dark');

  menuOpen$ = new BehaviorSubject<boolean>(true);
  menuItems = [
    { link: '/blog', icon: 'home', text: '首頁' },
    { link: '/blog/categories', icon: 'apps', text: '分類' },
    { link: '/blog/tags', icon: 'label', text: '標籤' },
    { link: '/blog/archives', icon: 'archive', text: '歸檔' },
  ];

  postCount$ = this.sitePostService.postsMeta$.pipe(
    map((posts) => Object.keys(posts || {}).length)
  );

  categoryCount$ = this.sitePostService.postCategories$.pipe(
    map((categories) => new Set(categories).size)
  );

  tagCount$ = this.sitePostService.postTags$.pipe(
    map((tags) => new Set(tags).size)
  );

  isSmallScreen$ = this.platformService.isSmallScreen$;

  searchKeyword = new FormControl<string>('');

  suggestList$ = combineLatest([
    this.sitePostService.postsMetaWithSlugAndSortDesc$,
    this.searchKeyword.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ),
  ]).pipe(
    switchMap(([posts, keywordString]) =>
      defer(() => import('../search-posts').then((m) => m.searchPosts)).pipe(
        map((searchFn) => searchFn(posts, keywordString || ''))
      )
    )
  );

  pageLoading$ = this.router.events.pipe(
    filter(
      (event) =>
        event instanceof NavigationStart || event instanceof NavigationEnd
    ),
    map((event) => event instanceof NavigationStart)
  );

  constructor(
    protected cdr: ChangeDetectorRef,
    private router: Router,
    private platformService: PlatformService,
    private sitePostService: SitePostService,
    private matIconRegistry: MatIconRegistry
  ) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationStart))
      .subscribe((url) => {
        if (this.matDrawerContent) {
          this.matDrawerContent.scrollTo({ top: 0, left: 0 });
          this.cdr.detectChanges();
        }
      });
  }

  ngOnInit() {
    this.matIconRegistry.registerFontClassAlias('fontawesome', 'fab');

    this.platformService.isSmallScreen$
      .pipe(map((result) => !result))
      .subscribe((shouldOpen) => {
        this.menuOpen$.next(shouldOpen);
      });

    this.setTheme();
    this.cdr.detectChanges();
  }

  async selectSuggestItem(event: MatAutocompleteSelectedEvent) {
    const item = event.option.value as { link: string };
    await this.router.navigateByUrl(item.link);
    this.searchKeyword.setValue('');
  }

  async goSearchPage(autocomplete: MatAutocomplete) {
    if (this.searchKeyword.value) {
      await this.router.navigate(['query'], {
        queryParams: { q: this.searchKeyword.value },
      });
      autocomplete._isOpen = false;
    }
  }

  setTheme() {
    if (this.platformService.isServer) {
      return;
    }

    const themeFromSetting = localStorage.getItem('theme') as WebsiteTheme;
    if (themeFromSetting) {
      this.theme$.next(themeFromSetting);
    } else if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: light)').matches
    ) {
      this.theme$.next('light');
    }

    this.theme$.subscribe((theme) => {
      localStorage.setItem('theme', theme || '');
      document.body.classList.remove('dark-theme');
      document.body.classList.remove('light-theme');
      document.body.classList.add(`${theme}-theme`);
      this.cdr.detectChanges();
    });
  }
}
