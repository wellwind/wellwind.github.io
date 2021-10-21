import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, timeout } from 'rxjs/operators';
import { MarkdownMeta, parseMarkdownMeta } from 'site-utils';
import { environment } from '../../environments/environment';
import { PostMeta } from '../post-meta.interface';

@Injectable({
  providedIn: 'root'
})
export class BlogContentResolve implements Resolve<MarkdownMeta> {
  constructor(private httpClient: HttpClient) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<MarkdownMeta> {
    return this.getMarkdownContent(route.paramMap.get('slug') as string);
  }

  private getMarkdownContent(slug: string) {
    return this.httpClient
      .get(`${environment.url}assets/blog/${slug}.md`, { responseType: 'text' })
      .pipe(
        timeout(3000),
        catchError(() => of('404')),
        map(content => parseMarkdownMeta(content, slug)!)
      );
  }
}
