import { HttpClient } from '@angular/common/http';
import { Injectable, TransferState, inject, makeStateKey } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, catchError, map, of, tap, timeout } from 'rxjs';
import { MarkdownMeta, parseMarkdownMeta } from 'site-utils';
import { environment } from '../../../../environments/environment';
import { PlatformService } from '../../../site-common/platform.service';

@Injectable({
  providedIn: 'root'
})
export class BlogContentResolve  {
  private httpClient = inject(HttpClient);
  private state = inject(TransferState);
  private platformService = inject(PlatformService);

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
