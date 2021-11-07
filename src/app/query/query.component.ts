import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, defer, Observable } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { SitePostService } from '../site-post.service';

@Component({
  selector: 'app-query',
  templateUrl: './query.component.html',
  styleUrls: ['./query.component.scss']
})
export class QueryComponent implements OnInit {
  searchKeyword$= this.route.queryParamMap.pipe(
    map(queryParamMap => `${queryParamMap.get('q')}`),
    filter(Boolean)
  );

  searchResult$ = combineLatest([
    this.sitePostService.postsMetaWithSlugAndSortDesc$,
    this.searchKeyword$ as Observable<string>
  ])
    .pipe(
      switchMap(([posts, keywordString]) =>
        defer(() => import('../search-posts').then(m => m.searchPosts))
          .pipe(map(searchFn => searchFn(posts, keywordString)))
      )
    )

  constructor(
    private sitePostService: SitePostService,
    private route: ActivatedRoute) {
  }

  ngOnInit(): void {
  }

}
