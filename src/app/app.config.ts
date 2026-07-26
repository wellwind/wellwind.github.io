import {
  APP_ID,
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { UrlSerializer, provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {
  provideClientHydration,
  withNoIncrementalHydration,
} from '@angular/platform-browser';
import { TrailingSlashUrlSerializer } from './site-common/trailing-slash-url-serializer';
import { provideHttpClient, withFetch } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(withNoIncrementalHydration()),
    provideHttpClient(withFetch()),
    { provide: APP_ID, useValue: 'fullstackladder-app' },
    { provide: UrlSerializer, useClass: TrailingSlashUrlSerializer },
  ],
};
