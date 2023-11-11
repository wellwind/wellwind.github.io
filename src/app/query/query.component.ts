import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Observable, combineLatest, defer, filter, map, startWith, switchMap } from 'rxjs';
import { SitePostService } from '../site-common/site-post.service';

@Component({
  selector: 'app-query',
  template: `
    <div class="p-4">
      @if (searchResult()) {

      <mat-toolbar class="search-header mat-elevation-z4 !mb-2">
        @if (searchKeyword()) {
        <h1>
          {{ searchKeyword() }}
        </h1>
        }
        <h2>搜尋結果</h2>
      </mat-toolbar>

      <mat-card appearance="outlined">
        <mat-card-content>
          <h2>共 {{ searchResult.length }} 篇文章</h2>

          @if (searchDateStart()) {
          <span class="search-chip">
            Start: {{ searchDateStart() | date : 'yyyy-MM-dd' }}
          </span>
          } @if (searchDateEnd()) {
          <span class="search-chip">
            End: {{ searchDateEnd() | date : 'yyyy-MM-dd' }}
          </span>
          }

          <mat-nav-list>
            @for (item of searchResult(); track item.link) {
            <mat-list-item [routerLink]="item.link">
              <div matLine class="search-result">
                @if ( ((searchDateStart()) || (searchDateEnd())) && item.type===
                '文章' ) {
                <span class="search-result-type">
                  {{ item.date | date : 'yyyy-MM-dd' }}
                </span>
                }
                <span class="search-result-type">{{ item.type }}</span>
                <span class="search-result-title">{{ item.text }}</span>
              </div>
            </mat-list-item>
            }
          </mat-nav-list>
        </mat-card-content>
      </mat-card>
      }
    </div>
  `,
  styles: `
    @use '../../variables';

    .search-result {
      display: flex !important;
      flex-direction: row;
      align-items: baseline;

      @media (max-width: 599.98px) {
        flex-direction: column;
        align-items: flex-start;
      }

      .search-result-type {
        color: var(--secondary-text-color);
        font-size: 14px;
        margin-right: 8px;
      }

      .search-result-title {
        color: var(--primary-text-color);
        font-size: 18px;
      }
    }

    .search-chip {
      color: white;
      background: var(--primary-color);
      margin: 2px;
      padding: 2px;
      border-radius: 4px;
    }
`,
  standalone: true,
  imports: [
    MatToolbarModule,
    MatCardModule,
    MatListModule,
    RouterLink,
    DatePipe,
  ],
})
export class QueryComponent {
  private sitePostService = inject(SitePostService);
  private route = inject(ActivatedRoute);

  private searchKeyword$ = this.route.queryParamMap.pipe(
    map((queryParamMap) => `${queryParamMap.get('q')}`),
    filter(Boolean),
    startWith('')
  );
  protected searchKeyword = toSignal(this.searchKeyword$, { initialValue: '' });

  private searchDateStart$ = this.route.queryParamMap.pipe(
    map((queryParamMap) => queryParamMap.get('start')),
    filter((startDate) => !!startDate),
    map((startDate) => new Date(startDate!)),
    startWith(undefined)
  );
  protected searchDateStart = toSignal(this.searchDateStart$, {
    initialValue: undefined,
  });

  private searchDateEnd$ = this.route.queryParamMap.pipe(
    map((queryParamMap) => queryParamMap.get('end')),
    filter((endDate) => !!endDate),
    map((endDate) => new Date(endDate!)),
    startWith(undefined)
  );
  protected searchDateEnd = toSignal(this.searchDateEnd$, {
    initialValue: undefined,
  });

  private searchResult$ = combineLatest([
    this.sitePostService.postsMetaWithSlugAndSortDesc$,
    this.searchKeyword$ as Observable<string>,
    this.searchDateStart$,
    this.searchDateEnd$,
  ]).pipe(
    switchMap(([posts, keywordString, start, end]) =>
      defer(() =>
        import('../site-common/search-posts').then((m) => {
          const searchByKeywordFn = m.searchPosts;
          const searchByDateFn = m.searchPostsByDateRange(start, end);
          return searchByKeywordFn(searchByDateFn(posts), keywordString);
        })
      )
    )
  );
  protected searchResult = toSignal(this.searchResult$, { initialValue: [] });
}
