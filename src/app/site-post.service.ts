import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { ascend, descend, prop, sortWith } from 'ramda';
import { combineLatest, iif, of } from 'rxjs';
import { map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { PlatformService } from '../platform.service';
import { PostMeta, PostMetaWithSlug } from './post-meta.interface';

const _cacheBlogPostsKey = makeStateKey('blog-posts.json');

@Injectable({
  providedIn: 'root'
})
export class SitePostService {

  public postsMeta$ = iif(
    () => !!this.state.get<{ [keg: string]: PostMeta } | null>(_cacheBlogPostsKey, null),
    of(this.state.get<{ [keg: string]: PostMeta } | null>(_cacheBlogPostsKey, null)!),
    this.httpClient
      .get<{ [keg: string]: PostMeta }>(`${environment.url}assets/blog-posts.json`)
      .pipe(
        tap(json => {
          if (this.platformService.isServer) {
            this.state.set<{ [keg: string]: PostMeta }>(_cacheBlogPostsKey, json)
          }
        })
      )
  ).pipe(
    shareReplay(1)
  );

  public postCategories$ = this.postsMeta$
    .pipe(
      map(posts => Object
        .keys(posts)
        .map(key => posts[key])
        .reduce((categories, post) => ([...categories, ...post.categories || []]), [] as string[])
      )
    );

  public postTags$ = this.postsMeta$
    .pipe(
      map(posts => Object
        .keys(posts)
        .map(key => posts[key])
        .reduce((tags, post) => ([...tags, ...post.tags || []]), [] as string[])
      )
    );

  public postsMetaWithSlug$ = this.postsMeta$
    .pipe(
      map(postsMeta => Object
        .keys(postsMeta)
        .map(key => ({ ...postsMeta[key], slug: key } as PostMetaWithSlug))
      )
    );

  public postsMetaWithSlugAndSortDesc$ = this.postsMetaWithSlug$
    .pipe(
      map(posts => sortWith([descend(prop('date'))], posts) as PostMetaWithSlug[])
    );

  public postsMetaWithSlugAndSortAsc$ = this.postsMetaWithSlug$
    .pipe(
      map(posts => sortWith([ascend(prop('date'))], posts) as PostMetaWithSlug[])
    );

  public categoriesAndPosts$ = combineLatest([this.postsMetaWithSlug$, this.postCategories$])
    .pipe(
      map(([posts, categories]) => categories
        .filter(category => !!category)
        .reduce((prev, category) => {
          if (!prev[category]) {
            prev[category] = posts.filter(post => (post.categories || []).find(cat => cat === category))
          }
          return prev;
        }, {} as { [key: string]: PostMetaWithSlug[] }))
    )

  public tagsAndPosts$ = combineLatest([this.postsMetaWithSlug$, this.postTags$])
    .pipe(
      map(([posts, tags]) => tags
        .filter(category => !!category)
        .reduce((prev, tag) => {
          if (!prev[tag]) {
            prev[tag] = posts.filter(post => (post.tags || []).find(tagName => tagName === tag))
          }
          return prev;
        }, {} as { [key: string]: PostMetaWithSlug[] }))
    )

  constructor(private httpClient: HttpClient, private state: TransferState, private platformService: PlatformService) {
  }
}
