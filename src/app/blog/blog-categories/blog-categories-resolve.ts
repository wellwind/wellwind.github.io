import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { PostMetaWithSlug } from '../../post-meta.interface';
import { SitePostService } from '../../site-post.service';

@Injectable({
  providedIn: 'root'
})
export class BlogCategoriesResolve  {
  constructor(private sitePostService: SitePostService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<{ [key:string] :PostMetaWithSlug[]}> {
    return this.sitePostService.categoriesAndPosts$;
  }
}
