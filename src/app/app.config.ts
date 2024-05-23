import { APP_ID, ApplicationConfig, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { UrlSerializer, provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { TrailingSlashUrlSerializer } from './site-common/trailing-slash-url-serializer';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(withFetch()),
    provideAnimations(),
    { provide: APP_ID, useValue: 'fullstackladder-app' },
    { provide: UrlSerializer, useClass: TrailingSlashUrlSerializer },
  ],
};
