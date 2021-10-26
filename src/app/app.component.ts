import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { MatDrawerContent } from '@angular/material/sidenav';
import { NavigationStart, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { PlatformService } from '../platform.service';
import { SiteMetaService } from './site-meta.service';
import { SitePostService } from './site-post.service';

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

  constructor(
    private router: Router,
    private platformService: PlatformService,
    private siteMetaService: SiteMetaService,
    private sitePostService: SitePostService,
    private breakpointObserver: BreakpointObserver,
    private matIconRegistry: MatIconRegistry) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationStart)
    ).subscribe(_ => {
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
  }

  ngOnInit() {
    this.matIconRegistry.registerFontClassAlias('fontawesome', 'fab');

    this.breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small
    ]).pipe(
      map(value => !value.matches)
    ).subscribe(shouldOpen => {
      this.menuOpen$.next(shouldOpen);
    });
  }

}
