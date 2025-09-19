import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { descend, prop, sortWith } from 'ramda';
import { PostMetaWithSlug } from '@shared/core';
import { Observable, map } from 'rxjs';
import { SitePostService } from '../../site-common/site-post.service';
import { findPosts } from '../find-posts';

@Injectable({
  providedIn: 'root'
})
export class BlogCategoriesPostsResolve  {
  private sitePostService = inject(SitePostService);

  resolve(route: ActivatedRouteSnapshot): Observable<PostMetaWithSlug[]> {
    const categorySlug = route.paramMap.get('category-slug') as string;

    return this.sitePostService.categoriesAndPosts$
      .pipe(
        map(result => findPosts(categorySlug, result)),
        map(posts => sortWith([descend(prop('date'))], posts))
      );
  }

}
