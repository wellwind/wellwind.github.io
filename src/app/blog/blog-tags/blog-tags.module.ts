import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SiteCommonModule } from '../../site-common/site-common.module';

import { BlogTagsRoutingModule } from './blog-tags-routing.module';
import { BlogTagsComponent } from './blog-tags.component';
import { BlogPostTagSizePipe } from './blog-post-tag-size.pipe';
import { BlogTagPostsComponent } from './blog-tag-posts/blog-tag-posts.component';


@NgModule({
  declarations: [
    BlogTagsComponent,
    BlogPostTagSizePipe,
    BlogTagPostsComponent
  ],
  imports: [
    CommonModule,
    SiteCommonModule,
    BlogTagsRoutingModule,
    MatCardModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule
  ]
})
export class BlogTagsModule { }