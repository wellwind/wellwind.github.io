import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';
import { PostMetaWithSlug } from '../../post-meta.interface';
import { SitePostService } from '../../site-post.service';

@Injectable({
  providedIn: 'root'
})
export class BlogArchivesPostsResolve implements Resolve<PostMetaWithSlug[]> {
  constructor(private sitePostService: SitePostService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PostMetaWithSlug[]> {
    return this.sitePostService.postsMetaWithSlugAndSortDesc$;
  }

}
