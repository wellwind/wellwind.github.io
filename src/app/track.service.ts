import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TrackService {
  private http = inject(HttpClient);

  sendTrack() {
    const trackUrl = environment.trackUrl;
    if (trackUrl) {
      this.http
        .post(trackUrl, { url: document.location.href })
        .pipe(catchError(() => of()))
        .subscribe();
    }
  }
}
