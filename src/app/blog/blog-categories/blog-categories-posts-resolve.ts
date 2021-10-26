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
import { slugify } from '../../site-common/slugify.pipe';
import { SitePostService } from '../../site-post.service';

@Injectable({
  providedIn: 'root'
})
export class BlogCategoriesPostsResolve implements Resolve<PostMetaWithSlug[]> {
  constructor(private sitePostService: SitePostService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PostMetaWithSlug[]> {
    const categorySlug = route.paramMap.get('category-slug') as string;
    const findPosts = (slug: string, data: { [key: string]: PostMetaWithSlug[] }) => {
      const found = Object
        .entries(data)
        .find(entry => slugify(entry[0]) === slug);
      if (found) {
        return found[1];
      }

      return [];
    }
    return this.sitePostService.categoriesAndPosts$
      .pipe(
        map(result => findPosts(categorySlug, result)),
        map(posts => sortWith([descend(prop('date'))], posts))
      );
  }

}
