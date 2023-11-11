import { Component } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { filter, pairwise, startWith } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { PlatformService } from '../platform.service';
import { SiteMetaService } from './site-meta.service';
import { TrackService } from './track.service';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { LayoutComponent } from './layout/layout.component';

declare let gtag: Function;

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatAutocompleteModule,
    MatOptionModule,
    MatFormFieldModule,
    MatProgressBarModule,
    ReactiveFormsModule,
    MatInputModule,
    LayoutComponent,
  ],
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
