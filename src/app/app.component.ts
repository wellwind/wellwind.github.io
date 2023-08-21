import { Component } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { filter, pairwise, startWith } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { PlatformService } from '../platform.service';
import { SiteMetaService } from './site-meta.service';
import { TrackService } from './track.service';

declare let gtag: Function;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(
    private router: Router,
    private platformService: PlatformService,
    private siteMetaService: SiteMetaService,
    private trackService: TrackService
  ) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationStart))
      .subscribe((url) => {
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
