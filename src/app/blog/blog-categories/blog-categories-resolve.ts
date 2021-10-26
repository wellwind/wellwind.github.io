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
export class BlogCategoriesResolve implements Resolve<{ [key:string] :PostMetaWithSlug[]}> {
  constructor(private sitePostService: SitePostService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<{ [key:string] :PostMetaWithSlug[]}> {
    return this.sitePostService.categoriesAndPosts$;
  }
}
