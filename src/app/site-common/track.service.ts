import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TrackService {
  private http = inject(HttpClient);

  sendTrack(referrer = '') {
    const trackUrl = environment.trackUrl;
    if (trackUrl) {
      this.http
        .post(trackUrl, {
          url: document.location.href,
          referrer: referrer || document.referrer,
        })
        .pipe(catchError(() => of()))
        .subscribe();
    }
  }
}
