import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { shareReplay } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { PostMeta } from './post-meta.interface';

@Injectable({
  providedIn: 'root'
})
export class SitePostService {

  public postsMeta$ = this.httpClient
    .get<{ [keg: string]: PostMeta }>(`${environment.url}assets/blog-posts.json`)
    .pipe(shareReplay(1))

  constructor(private httpClient: HttpClient) {
  }
}
