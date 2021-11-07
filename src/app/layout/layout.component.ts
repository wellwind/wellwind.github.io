import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatIconRegistry } from '@angular/material/icon';
import { MatDrawerContent } from '@angular/material/sidenav';
import { NavigationStart, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, defer } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, switchMap } from 'rxjs/operators';
import { slugify } from '../../../utils/slugify';
import { PlatformService } from '../../platform.service';
import { PostMetaWithSlug } from '../post-meta.interface';
import { SiteMetaService } from '../site-meta.service';
import { SitePostService } from '../site-post.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  @ViewChild('matDrawerContent') matDrawerContent?: MatDrawerContent

  get isServer() {
    return this.platformService.isServer;
  }

  menuOpen$ = new BehaviorSubject<boolean>(true);
  menuItems = [
    { link: '/blog', icon: 'home', text: '首頁' },
    { link: '/blog/categories', icon: 'apps', text: '分類' },
    { link: '/blog/tags', icon: 'label', text: '標籤' },
    { link: '/blog/archives', icon: 'archive', text: '歸檔' }
  ];

  postCount$ = this.sitePostService.postsMeta$.pipe(
    map(posts => Object.keys(posts).length)
  );

  categoryCount$ = this.sitePostService.postCategories$.pipe(
    map(categories => new Set(categories).size)
  );

  tagCount$ = this.sitePostService.postTags$.pipe(
    map(tags => new Set(tags).size)
  );

  isSmallScreen$ = this.platformService.isSmallScreen$;

  searchKeyword = new FormControl();

  suggestList$ = combineLatest([
    this.sitePostService.postsMetaWithSlugAndSortDesc$,
    this.searchKeyword.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    )])
    .pipe(
      switchMap(([posts, keywordString]) =>
        defer(() => import('../search-posts').then(m => m.searchPosts))
          .pipe(map(searchFn => searchFn(posts, keywordString)))
      )
    )

  constructor(
    private router: Router,
    private platformService: PlatformService,
    private sitePostService: SitePostService,
    private matIconRegistry: MatIconRegistry) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationStart)
    ).subscribe(url => {
      if (this.matDrawerContent) {
        this.matDrawerContent.scrollTo({ top: 0, left: 0 });
      }
    });
  }

  ngOnInit() {
    this.matIconRegistry.registerFontClassAlias('fontawesome', 'fab');

    this.platformService
      .isSmallScreen$
      .pipe(map(result => !result))
      .subscribe(shouldOpen => {
        this.menuOpen$.next(shouldOpen);
      });
  }

  async selectSuggestItem(event: MatAutocompleteSelectedEvent) {
    const item = event.option.value as { link: string };
    await this.router.navigateByUrl(item.link);
    this.searchKeyword.setValue('');
  }

  async goSearchPage(autocomplete: MatAutocomplete) {
    if (this.searchKeyword.value) {
      await this.router.navigate(
        ['query'],
        { queryParams: { q: this.searchKeyword.value } });
      autocomplete._isOpen = false;
    }
  }
}
