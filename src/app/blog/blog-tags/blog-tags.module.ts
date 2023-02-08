import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { PushModule } from '@rx-angular/template/push';
import { PostDateAsPathModule } from 'src/app/site-common/post-date-as-path/post-date-as-path.module';
import { BlogPostSubtitleModule } from './../../site-common/blog-post-subtitle/blog-post-subtitle.module';
import { PaginationModule } from './../../site-common/pagination/pagination.module';
import { SlugifyModule } from './../../site-common/slugify/slugify.module';
import { UnslugifyModule } from './../../site-common/unslugify/unslugify.module';

import { BlogPostTagSizePipe } from './blog-post-tag-size.pipe';
import { BlogTagPostsComponent } from './blog-tag-posts/blog-tag-posts.component';
import { BlogTagsRoutingModule } from './blog-tags-routing.module';
import { BlogTagsComponent } from './blog-tags.component';


@NgModule({
  declarations: [
    BlogTagsComponent,
    BlogPostTagSizePipe,
    BlogTagPostsComponent
  ],
  imports: [
    CommonModule,
    BlogTagsRoutingModule,
    BlogPostSubtitleModule,
    SlugifyModule,
    UnslugifyModule,
    PostDateAsPathModule,
    PaginationModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    PushModule
  ]
})
export class BlogTagsModule { }
