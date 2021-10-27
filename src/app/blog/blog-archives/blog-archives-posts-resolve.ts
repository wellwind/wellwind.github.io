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
import { findPosts } from '../find-posts';

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
