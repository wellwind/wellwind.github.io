import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot
} from '@angular/router';
import { descend, prop, sortWith } from 'ramda';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PostMetaWithSlug } from '../../post-meta.interface';
import { SitePostService } from '../../site-post.service';
import { findPosts } from '../find-posts';

@Injectable({
  providedIn: 'root'
})
export class BlogTagsPostsResolve implements Resolve<PostMetaWithSlug[]> {
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
