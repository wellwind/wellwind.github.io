import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { PlatformService } from '@shared/infrastructure';
import { environment } from '../environments/environment';
import { LayoutComponent } from './layout/layout.component';
import { SiteMetaService } from './site-common/site-meta.service';
import { filter, pairwise, startWith } from 'rxjs';
import { faro } from '@grafana/faro-web-sdk';

declare const gtag: (
  command: string,
  action: string,
  config: { page_path: string },
) => void;

@Component({
  selector: 'app-root',
  imports: [LayoutComponent],
  template: `<app-layout></app-layout>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly platformService = inject(PlatformService);
  private readonly siteMetaService = inject(SiteMetaService);

  ngOnInit() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationStart),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.siteMetaService.resetMeta({
          title: '',
          description: '個人學習程式設計、系統開發和讀書的經驗及心得。',
          keywords: [],
          type: 'website',
        });
      });

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        startWith(null),
        pairwise(),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((events) => {
        if (!this.platformService.isServer && environment.production) {
          const event = events[1] as NavigationEnd | undefined;
          if (!event) {
            return;
          }

          if (faro.api) {
            faro.api.pushEvent('page_change', { url: event.url });
            faro.api.setPage({
              id: event.url,
              url: event.url,
            });
            faro.api.setView({ name: event.url });
          }

          gtag('event', 'page_view', {
            page_path: event.url || '',
          });
        }
      });
  }
}
