import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  CanActivate,
  Resolve,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import * as markdownIt from 'markdown-it';
import { Observable, of } from 'rxjs';
import { catchError, map, timeout } from 'rxjs/operators';
import { environment } from '../../environments/environment';

const markdown = markdownIt();

@Injectable({
  providedIn: 'root'
})
export class BlogContentResolve implements Resolve<SafeHtml> {
  constructor(private httpClient: HttpClient, private domSanitizer: DomSanitizer) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<SafeHtml> {
    return this.getMarkdownContent(route.paramMap.get('slug') as string);
  }

  private getMarkdownContent(slug: string) {
    return this.httpClient
      .get(`${environment.url}assets/blog/${slug}/${slug}.md`, { responseType: 'text' })
      .pipe(
        timeout(3000),
        catchError(() => of('404')),
        map(content => markdown.render(content)),
        map(content => content.replace(/\{% asset_img (.*) (.*)%\}/g, `<img src="./assets/blog/${slug}/$1" alt="$2" />`)),
        map(content => this.domSanitizer.bypassSecurityTrustHtml(content))
      );
  }
}
