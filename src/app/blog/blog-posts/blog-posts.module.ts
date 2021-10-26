import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SiteCommonModule } from '../../site-common/site-common.module';
import { BlogPostTocComponent } from './blog-post-toc/blog-post-toc.component';
import { BlogPostComponent } from './blog-post/blog-post.component';

import { BlogPostsRoutingModule } from './blog-posts-routing.module';
import { BlogPostsComponent } from './blog-posts.component';

@NgModule({
  declarations: [
    BlogPostComponent,
    BlogPostsComponent,
    BlogPostTocComponent
  ],
  imports: [
    CommonModule,
    BlogPostsRoutingModule,
    MatCardModule,
    MatIconModule,
    SiteCommonModule,
    MatButtonModule,
    MatDividerModule,
    MatTooltipModule
  ]
})
export class BlogPostsModule {
}
