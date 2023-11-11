import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, timeout } from 'rxjs/operators';
import { MarkdownMeta, parseMarkdownMeta } from 'site-utils';
import { environment } from '../../../environments/environment';
import { PostMeta, PostMetaWithSlug } from '../../site-common/post-meta.interface';
import { SitePostService } from '../../site-common/site-post.service';

@Injectable({
  providedIn: 'root'
})
export class BlogTagsResolve  {
  constructor(private sitePostService: SitePostService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<{ [key: string]: PostMetaWithSlug[] }> {
    return this.sitePostService.tagsAndPosts$;
  }
}
