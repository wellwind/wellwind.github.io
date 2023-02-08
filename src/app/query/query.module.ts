import { PushModule } from '@rx-angular/template/push';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';

import { QueryRoutingModule } from './query-routing.module';
import { QueryComponent } from './query.component';

@NgModule({
  declarations: [QueryComponent],
  imports: [
    CommonModule,
    QueryRoutingModule,
    MatCardModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    PushModule,
  ],
})
export class QueryModule {}
