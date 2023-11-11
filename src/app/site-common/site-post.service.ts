import { HttpClient } from '@angular/common/http';
import { Injectable, TransferState, makeStateKey } from '@angular/core';
import { ascend, descend, prop, sortWith } from 'ramda';
import { combineLatest, iif, of } from 'rxjs';
import { map, shareReplay, startWith, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { PlatformService } from '../../platform.service';
import { PostMeta, PostMetaWithSlug } from './post-meta.interface';
import { toSignal } from '@angular/core/rxjs-interop';

type PostMetaCollection = { [keg: string]: PostMeta } | null;
const _cacheBlogPostsKey = makeStateKey<PostMetaCollection>('blog-posts.json');

@Injectable({
  providedIn: 'root',
})
export class SitePostService {
  postsMeta$ = iif(
    () => !!this.state.get<PostMetaCollection>(_cacheBlogPostsKey, null),
    of(this.state.get<PostMetaCollection>(_cacheBlogPostsKey, null)!),
    this.httpClient
      .get<PostMetaCollection>(`${environment.url}assets/blog-posts.json`)
      .pipe(
        tap((json) => {
          if (this.platformService.isServer) {
            this.state.set<PostMetaCollection>(_cacheBlogPostsKey, json);
          }
        })
      )
  ).pipe(startWith({} as PostMetaCollection), shareReplay(1));

  postsMeta = toSignal(this.postsMeta$, {
    initialValue: {} as PostMetaCollection,
  });

  postCategories$ = this.postsMeta$.pipe(
    map((posts) =>
      Object.keys(posts || {})
        .map((key) => (posts || {})[key])
        .reduce(
          (categories, post) => [...categories, ...(post.categories || [])],
          [] as string[]
        )
    )
  );

  postCategories = toSignal(this.postCategories$, { initialValue: [] });

  postTags$ = this.postsMeta$.pipe(
    map((posts) =>
      Object.keys(posts || {})
        .map((key) => (posts || {})[key])
        .reduce(
          (tags, post) => [...tags, ...(post.tags || [])],
          [] as Array<string>
        )
    )
  );

  postTags = toSignal(this.postTags$, { initialValue: [] });

  postsMetaWithSlug$ = this.postsMeta$.pipe(
    map((postsMeta) =>
      Object.keys(postsMeta || {}).map(
        (key) => ({ ...(postsMeta || {})[key], slug: key } as PostMetaWithSlug)
      )
    )
  );

  postsMetaWithSlugAndSortDesc$ = this.postsMetaWithSlug$.pipe(
    map(
      (posts) => sortWith([descend(prop('date'))], posts) as PostMetaWithSlug[]
    )
  );

  postsMetaWithSlugAndSortAsc$ = this.postsMetaWithSlug$.pipe(
    map(
      (posts) => sortWith([ascend(prop('date'))], posts) as PostMetaWithSlug[]
    )
  );

  categoriesAndPosts$ = combineLatest([
    this.postsMetaWithSlug$,
    this.postCategories$,
  ]).pipe(
    map(([posts, categories]) =>
      categories
        .filter((category) => !!category)
        .reduce((prev, category) => {
          if (!prev[category]) {
            prev[category] = posts.filter((post) =>
              (post.categories || []).find((cat) => cat === category)
            );
          }
          return prev;
        }, {} as { [key: string]: PostMetaWithSlug[] })
    )
  );

  tagsAndPosts$ = combineLatest([this.postsMetaWithSlug$, this.postTags$]).pipe(
    map(([posts, tags]) =>
      tags
        .filter((category) => !!category)
        .reduce((prev, tag) => {
          if (!prev[tag]) {
            prev[tag] = posts.filter((post) =>
              (post.tags || []).find((tagName) => tagName === tag)
            );
          }
          return prev;
        }, {} as { [key: string]: PostMetaWithSlug[] })
    )
  );

  constructor(
    private httpClient: HttpClient,
    private state: TransferState,
    private platformService: PlatformService
  ) {}
}
