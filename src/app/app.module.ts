import { HttpClientModule } from '@angular/common/http';
import { APP_ID, NgModule } from '@angular/core';
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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UrlSerializer } from '@angular/router';
import { PushModule } from '@rx-angular/template/push';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutComponent } from './layout/layout.component';
import { TrailingSlashUrlSerializer } from './trailing-slash-url-serializer';

@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
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
    PushModule,
    LayoutComponent,
  ],
  providers: [
    { provide: APP_ID, useValue: 'fullstackladder-app' },
    { provide: UrlSerializer, useClass: TrailingSlashUrlSerializer },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
