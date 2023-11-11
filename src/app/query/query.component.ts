import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Observable, combineLatest, defer } from 'rxjs';
import { filter, map, startWith, switchMap } from 'rxjs/operators';
import { SitePostService } from '../site-post.service';

@Component({
  selector: 'app-query',
  templateUrl: './query.component.html',
  styleUrls: ['./query.component.scss'],
  standalone: true,
  imports: [
    MatToolbarModule,
    MatCardModule,
    MatListModule,
    RouterLink,
    DatePipe,
    AsyncPipe,
  ],
})
export class QueryComponent implements OnInit {
  searchKeyword$ = this.route.queryParamMap.pipe(
    map((queryParamMap) => `${queryParamMap.get('q')}`),
    filter(Boolean),
    startWith('')
  );

  searchDateStart$ = this.route.queryParamMap.pipe(
    map((queryParamMap) => queryParamMap.get('start')),
    filter((startDate) => !!startDate),
    map((startDate) => new Date(startDate!)),
    startWith(undefined)
  );

  searchDateEnd$ = this.route.queryParamMap.pipe(
    map((queryParamMap) => queryParamMap.get('end')),
    filter((endDate) => !!endDate),
    map((endDate) => new Date(endDate!)),
    startWith(undefined)
  );

  searchResult$ = combineLatest([
    this.sitePostService.postsMetaWithSlugAndSortDesc$,
    this.searchKeyword$ as Observable<string>,
    this.searchDateStart$,
    this.searchDateEnd$,
  ]).pipe(
    switchMap(([posts, keywordString, start, end]) =>
      defer(() =>
        import('../search-posts').then((m) => {
          const searchByKeywordFn = m.searchPosts;
          const searchByDateFn = m.searchPostsByDateRange(start, end);
          return searchByKeywordFn(searchByDateFn(posts), keywordString);
        })
      )
    )
  );

  constructor(
    private sitePostService: SitePostService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {}
}
