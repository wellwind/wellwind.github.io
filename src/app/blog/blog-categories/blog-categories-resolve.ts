import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { PostMetaWithSlug } from '../../site-common/post-meta.interface';
import { SitePostService } from '../../site-common/site-post.service';

@Injectable({
  providedIn: 'root'
})
export class BlogCategoriesResolve  {
  private sitePostService = inject(SitePostService);

  resolve(): Observable<{ [key:string] :PostMetaWithSlug[]}> {
    return this.sitePostService.categoriesAndPosts$;
  }
}
