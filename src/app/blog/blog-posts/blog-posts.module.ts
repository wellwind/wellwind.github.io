import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PushModule } from '@rx-angular/template/push';
import { SiteCommonModule } from '../../site-common/site-common.module';
import { BlogPostTocComponent } from './blog-post-toc/blog-post-toc.component';
import { BlogPostComponent } from './blog-post/blog-post.component';

import { BlogPostsRoutingModule } from './blog-posts-routing.module';
import { BlogPostsComponent } from './blog-posts.component';

@NgModule({
  declarations: [BlogPostComponent, BlogPostsComponent, BlogPostTocComponent],
  imports: [
    CommonModule,
    BlogPostsRoutingModule,
    MatCardModule,
    MatIconModule,
    SiteCommonModule,
    MatButtonModule,
    MatDividerModule,
    MatTooltipModule,
    MatChipsModule,
    PushModule,
  ],
})
export class BlogPostsModule {}
