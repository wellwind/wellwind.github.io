import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { descend, prop, sortWith } from 'ramda';
import { Observable, map } from 'rxjs';
import { PostMetaWithSlug } from '../../site-common/post-meta.interface';
import { SitePostService } from '../../site-common/site-post.service';
import { findPosts } from '../find-posts';

@Injectable({
  providedIn: 'root'
})
export class BlogTagsPostsResolve  {
  constructor(private sitePostService: SitePostService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PostMetaWithSlug[]> {
    const tagSlug = route.paramMap.get('tag-slug') as string;

    return this.sitePostService.tagsAndPosts$
      .pipe(
        map(result => findPosts(tagSlug, result)),
        map(posts => sortWith([descend(prop('date'))], posts))
      );
  }

}
