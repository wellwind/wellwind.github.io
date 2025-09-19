import { HttpClient } from '@angular/common/http';
import { Injectable, TransferState, inject, makeStateKey } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Observable, catchError, map, of, tap, timeout } from 'rxjs';
import { parseMarkdownMeta } from '@features/post-detail/domain';
import { MarkdownMeta } from '@shared/core';
import { environment } from '../../../../environments/environment';
import { PlatformService } from '@shared/infrastructure';

@Injectable({
  providedIn: 'root'
})
export class BlogContentResolve  {
  private httpClient = inject(HttpClient);
  private state = inject(TransferState);
  private platformService = inject(PlatformService);

  resolve(route: ActivatedRouteSnapshot): Observable<MarkdownMeta> {
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
