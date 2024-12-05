import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { PlatformService } from 'src/app/site-common/platform.service';
import { environment } from '../environments/environment';
import { LayoutComponent } from './layout/layout.component';
import { SiteMetaService } from './site-common/site-meta.service';
import { filter, pairwise, startWith } from 'rxjs';

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
  private router = inject(Router);
  private platformService = inject(PlatformService);
  private siteMetaService = inject(SiteMetaService);

  ngOnInit() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationStart))
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
      )
      .subscribe((events) => {
        if (!this.platformService.isServer && environment.production) {
          gtag('event', 'page_view', {
            page_path: (events[1] as NavigationEnd | null)?.url || '',
          });
        }
      });
  }
}
