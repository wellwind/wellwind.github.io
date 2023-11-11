import { Component, inject } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { PlatformService } from 'src/platform.service';
import { environment } from '../environments/environment';
import { LayoutComponent } from './layout/layout.component';
import { SiteMetaService } from './site-common/site-meta.service';
import { TrackService } from './site-common/track.service';
import { filter, pairwise, startWith } from 'rxjs';

declare let gtag: Function;

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [
    LayoutComponent,
  ],
  template: `<app-layout></app-layout>`
})
export class AppComponent {
  private router = inject(Router);
  private platformService = inject(PlatformService);
  private siteMetaService = inject(SiteMetaService);
  private trackService = inject(TrackService);

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
        pairwise()
      )
      .subscribe((events: [any, any]) => {
        if (!this.platformService.isServer && environment.production) {
          this.trackService.sendTrack(events[0]?.url || '');
          gtag('event', 'page_view', { page_path: events[1].url });
        }
      });
  }
}
