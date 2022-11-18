import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SiteCommonModule } from '../site-common/site-common.module';

import { QueryRoutingModule } from './query-routing.module';
import { QueryComponent } from './query.component';


@NgModule({
  declarations: [
    QueryComponent
  ],
  imports: [
    CommonModule,
    QueryRoutingModule,
    SiteCommonModule,
    MatCardModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule
  ]
})
export class QueryModule { }
