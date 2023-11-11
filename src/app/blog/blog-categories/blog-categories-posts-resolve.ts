import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { descend, prop, sortWith } from 'ramda';
import { Observable, map } from 'rxjs';
import { PostMetaWithSlug } from '../../site-common/post-meta.interface';
import { SitePostService } from '../../site-common/site-post.service';
import { findPosts } from '../find-posts';

@Injectable({
  providedIn: 'root'
})
export class BlogCategoriesPostsResolve  {
  private sitePostService = inject(SitePostService);

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PostMetaWithSlug[]> {
    const categorySlug = route.paramMap.get('category-slug') as string;

    return this.sitePostService.categoriesAndPosts$
      .pipe(
        map(result => findPosts(categorySlug, result)),
        map(posts => sortWith([descend(prop('date'))], posts))
      );
  }

}
