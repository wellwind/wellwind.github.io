import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ascend, descend, prop, sortWith } from 'ramda';
import { map, shareReplay } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { PostMeta } from './post-meta.interface';

@Injectable({
  providedIn: 'root'
})
export class SitePostService {

  public postsMeta$ = this.httpClient
    .get<{ [keg: string]: PostMeta }>(`${environment.url}assets/blog-posts.json`)
    .pipe(shareReplay(1))

  public postsMetaWithSlug$ = this.postsMeta$.pipe(
    map(postsMeta => Object.keys(postsMeta).map(key => ({ ...postsMeta[key], slug: key })))
  );

  public postsMetaWithSlugAndSortDesc$ = this.postsMetaWithSlug$.pipe(
    map(posts => sortWith([descend(prop('date'))], posts))
  );

  public postsMetaWithSlugAndSortAsc$ = this.postsMetaWithSlug$.pipe(
    map(posts => sortWith([ascend(prop('date'))], posts))
  );

  constructor(private httpClient: HttpClient) {
  }
}
