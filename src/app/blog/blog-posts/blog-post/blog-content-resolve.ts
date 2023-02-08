import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, tap, timeout } from 'rxjs/operators';
import { MarkdownMeta, parseMarkdownMeta } from 'site-utils';
import { environment } from '../../../../environments/environment';
import { PlatformService } from '../../../../platform.service';

@Injectable({
  providedIn: 'root'
})
export class BlogContentResolve implements Resolve<MarkdownMeta> {
  constructor(private httpClient: HttpClient, private state: TransferState, private platformService: PlatformService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<MarkdownMeta> {
    return this.getMarkdownContent(route.paramMap.get('slug') as string);
  }

  private getMarkdownContent(slug: string) {
    const key = makeStateKey<string>(slug);

    const content = this.state.get<string>(key, '');
    if (content) {
      return of(parseMarkdownMeta(content, slug)!);
    }
    return this.httpClient
      .get(`${environment.url}assets/blog/${slug}.md`, { responseType: 'text' })
      .pipe(
        timeout(3000),
        catchError(() => of('404')),
        tap((content: string) => {
          if (this.platformService.isServer) {
            this.state.set<string>(key, content);
          }
        }),
        map(content => parseMarkdownMeta(content, slug)!)
      );
  }
}
