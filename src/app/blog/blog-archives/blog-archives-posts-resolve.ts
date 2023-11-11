import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { PostMetaWithSlug } from '../../site-common/post-meta.interface';
import { SitePostService } from '../../site-common/site-post.service';

@Injectable({
  providedIn: 'root',
})
export class BlogArchivesPostsResolve {
  private sitePostService = inject(SitePostService);

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<PostMetaWithSlug[]> {
    return this.sitePostService.postsMetaWithSlugAndSortDesc$;
  }
}
