import { Component, HostBinding, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatOptionSelectionChange } from '@angular/material/core';
import { MatIconRegistry } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatDrawerContent } from '@angular/material/sidenav';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { slugify } from '../../utils/slugify';
import { environment } from '../environments/environment';
import { PlatformService } from '../platform.service';
import { SiteMetaService } from './site-meta.service';
import { SitePostService } from './site-post.service';

declare let gtag: Function;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
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
      map(([posts, keywordString]) => {
        let result = [];

        let searchType = 'any';
        let keyword = '';
        const chunks = keywordString.split(':');
        if (chunks.length > 1) {
          searchType = chunks[0].toLowerCase();
          keyword = chunks[1];
        } else {
          keyword = chunks[0];
        }
        console.log(keyword);

        if (searchType === 'any' || searchType === 'post') {
          const relatePosts = posts
            .filter(post => post.title.toLowerCase().indexOf(keyword.toLowerCase()) >= 0)
            .sort((postA, postB) =>
              postA.title.toLowerCase().indexOf(keyword.toLowerCase()) - postB.title.toLowerCase().indexOf(keyword.toLowerCase()))
          result.push(...relatePosts.map(post => ({
            type: '文章',
            text: post.title,
            link: `/blog/${post.date.slice(0, 10).replace(/-/g, '/')}/${post.slug}`,
            toString: () => ''
          })));
        }

        if (searchType === 'any' || searchType === 'category') {
          const allCategories = posts
            .reduce((curr, post) => ([...new Set([...curr, ...post.categories || []])]), [] as string[])

          const relatedCategories = allCategories.filter((category: string) => category.toLowerCase().indexOf(keyword.toLowerCase()) >= 0)
            .sort((categoryA, categoryB) =>
              categoryA.toLowerCase().indexOf(keyword.toLowerCase()) - categoryB.toLowerCase().indexOf(keyword.toLowerCase()))
          result.push(...relatedCategories.map(category => ({
            type: '分類',
            text: category,
            link: `/blog/categories/${slugify(category)}`,
            toString: () => ''
          })));
        }

        if (searchType === 'any' || searchType === 'tag') {
          const allTags = posts
            .reduce((curr, post) => ([...new Set([...curr, ...post.tags || []])]), [] as string[])

          const relatedTags = allTags
            .filter((tag: string) => tag.toLowerCase().indexOf(keyword.toLowerCase()) >= 0)
            .sort((tagA, tagB) =>
              tagA.toLowerCase().indexOf(keyword.toLowerCase()) - tagB.toLowerCase().indexOf(keyword.toLowerCase()))
          result.push(...relatedTags.map(tag => ({
            type: '標籤',
            text: tag,
            link: `/blog/tags/${slugify(tag)}`,
            toString: () => ''
          })));
        }

        return result;
      })
    )

  constructor(
    private router: Router,
    private platformService: PlatformService,
    private siteMetaService: SiteMetaService,
    private sitePostService: SitePostService,
    private matIconRegistry: MatIconRegistry) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationStart)
    ).subscribe(url => {
      this.siteMetaService.resetMeta({
        title: '',
        description: '個人學習程式設計、系統開發和讀書的經驗及心得。',
        keywords: [],
        type: 'website'
      });
      if (this.matDrawerContent) {
        this.matDrawerContent.scrollTo({ top: 0, left: 0 });
      }
    });

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      if (!this.platformService.isServer && environment.production) {
        gtag('event', 'page_view', { 'page_path': event.url });
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
}
