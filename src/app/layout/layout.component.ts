import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatIconRegistry } from '@angular/material/icon';
import { MatDrawerContent } from '@angular/material/sidenav';
import { NavigationStart, Router } from '@angular/router';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
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
      map(([posts, keywordString]) => {
        const filterPostBy = (keyword: string) => (post: PostMetaWithSlug) =>
          post.title.toLowerCase().indexOf(keyword.toLowerCase()) >= 0
          || post.summary.toLowerCase().indexOf(keyword.toLowerCase()) >= 0;

        let result = [];

        let searchType = 'any';
        let searchField = '';
        let searchFrom = '';
        let keyword = '';
        const chunks = keywordString.split(':');
        if (chunks.length > 2) {
          searchType = 'post';
          searchField = chunks[0];
          searchFrom = chunks[1];
          keyword = chunks[2];
        } else if (chunks.length > 1) {
          searchType = chunks[0].toLowerCase();
          keyword = chunks[1];
        } else {
          keyword = chunks[0];
        }

        if (searchType === 'any' || searchType === 'post') {
          const relatePosts = posts
            .filter(post => {
              const filterKeywordFn = filterPostBy(keyword);
              if (searchField === 'category') {
                return filterKeywordFn(post) && !!(post.categories || []).find((category) => category.toLowerCase().indexOf(searchFrom.toLowerCase()) >= 0);
              } else if (searchField === 'tag') {
                return filterKeywordFn(post) && !!(post.tags || []).find((tag) => tag.toLowerCase().indexOf(searchFrom.toLowerCase()) >= 0);
              } else {
                return filterKeywordFn(post);
              }
            })
            .sort((postA, postB) =>
              postA.title.toLowerCase().indexOf(keyword.toLowerCase()) - postB.title.toLowerCase().indexOf(keyword.toLowerCase()))
          result.push(...relatePosts.map(post => ({
            type: `${searchField}${searchField ? ':' : ''}${searchFrom}${searchFrom ? ':' : ''}文章`,
            text: post.title,
            link: `/blog/${post.date.slice(0, 10).replace(/-/g, '/')}/${post.slug}`,
            toString: () => ''
          })));
        }

        if (searchType === 'any' || searchType === 'category') {
          const allCategories = posts
            .reduce((curr, post) => ([...new Set([...curr, ...post.categories || []])]), [] as string[])

          const relatedCategories = allCategories.filter((category: string) =>
            category.toLowerCase().indexOf(keyword.toLowerCase()) >= 0
          )
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
}
