import { APP_ID, ApplicationConfig } from '@angular/core';
import { UrlSerializer, provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { TrailingSlashUrlSerializer } from './trailing-slash-url-serializer';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(withFetch()),
    provideAnimations(),
    { provide: APP_ID, useValue: 'fullstackladder-app' },
    { provide: UrlSerializer, useClass: TrailingSlashUrlSerializer },
  ],
};
