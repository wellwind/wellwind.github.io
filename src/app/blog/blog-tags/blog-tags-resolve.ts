import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, timeout } from 'rxjs/operators';
import { MarkdownMeta, parseMarkdownMeta } from 'site-utils';
import { environment } from '../../../environments/environment';
import { PostMeta, PostMetaWithSlug } from '../../post-meta.interface';
import { SitePostService } from '../../site-post.service';

@Injectable({
  providedIn: 'root'
})
export class BlogTagsResolve implements Resolve<{ [key: string]: PostMetaWithSlug[] }> {
  constructor(private sitePostService: SitePostService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<{ [key: string]: PostMetaWithSlug[] }> {
    return this.sitePostService.tagsAndPosts$;
  }
}
