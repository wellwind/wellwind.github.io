import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
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