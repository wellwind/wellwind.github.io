import { Injectable, inject } from '@angular/core';
import { PostMetaWithSlug } from '@shared/core';
import { Observable } from 'rxjs';
import { SitePostService } from '../../site-common/site-post.service';

@Injectable({
  providedIn: 'root',
})
export class BlogArchivesPostsResolve {
  private readonly sitePostService = inject(SitePostService);

  resolve(): Observable<PostMetaWithSlug[]> {
    return this.sitePostService.postsMetaWithSlugAndSortDesc$;
  }
}
