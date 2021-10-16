import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { SitePostService } from './site-post.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  menuOpen$ = new BehaviorSubject<boolean>(true);
  menuItems = [
    { link: '/blog', icon: 'home', text: '首頁' },
    { link: '/blog/categories', icon: 'apps', text: '分類' },
    { link: '/blog/tag', icon: 'label', text: '標籤' },
    { link: '/blog/archives', icon: 'archive', text: '歸檔' }
  ];

  postCount$ = this.sitePostService.postsMeta$.pipe(
    map(posts => Object.keys(posts).length)
  );
  categoryCount$ = this.sitePostService.postsMeta$.pipe(
    map(posts => Object
      .keys(posts)
      .map(key => posts[key])
      .reduce((categories, post) => {
        console.log(categories, post.categories);
        return [...categories, ...post.categories];
      }, [] as string[])
    ),
    map(categories => new Set(categories).size)
  );
  tagCount$ = this.sitePostService.postsMeta$.pipe(
    map(posts => Object
      .keys(posts)
      .map(key => posts[key])
      .reduce((tags, post) => ([...tags, ...post.tags]), [] as string[])
    ),
    map(tags => new Set(tags).size)
  );

  constructor(
    private sitePostService: SitePostService,
    private breakpointObserver: BreakpointObserver,
    private matIconRegistry: MatIconRegistry) {
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
