import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { PushModule } from '@rx-angular/template/push';
import { BlogPostSubtitleModule } from './../../site-common/blog-post-subtitle/blog-post-subtitle.module';
import { PaginationModule } from './../../site-common/pagination/pagination.module';
import { PostDateAsPathModule } from 'src/app/site-common/post-date-as-path/post-date-as-path.module';
import { BlogArchivesRoutingModule } from './blog-archives-routing.module';
import { BlogArchivesComponent } from './blog-archives.component';

@NgModule({
  declarations: [
    BlogArchivesComponent
  ],
  imports: [
    CommonModule,
    BlogArchivesRoutingModule,
    PaginationModule,
    BlogPostSubtitleModule,
    PostDateAsPathModule,
    MatToolbarModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    PushModule
  ]
})
export class BlogArchivesModule { }
