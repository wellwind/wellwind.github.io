import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SiteCommonModule } from '../../site-common/site-common.module';

import { BlogArchivesRoutingModule } from './blog-archives-routing.module';
import { BlogArchivesComponent } from './blog-archives.component';


@NgModule({
  declarations: [
    BlogArchivesComponent
  ],
  imports: [
    CommonModule,
    BlogArchivesRoutingModule,
    MatToolbarModule,
    MatCardModule,
    SiteCommonModule,
    MatIconModule,
    MatButtonModule
  ]
})
export class BlogArchivesModule { }
