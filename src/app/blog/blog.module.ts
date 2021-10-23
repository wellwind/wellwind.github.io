import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SiteCommonModule } from '../site-common/site-common.module';

import { BlogRoutingModule } from './blog-routing.module';
import { BlogLayoutComponent } from './blog-layout/blog-layout.component';
import { BlogPostComponent } from './blog-post/blog-post.component';
import { BlogPostsComponent } from './blog-posts/blog-posts.component';
import { BlogPostSubtitleComponent } from './blog-post-subtitle/blog-post-subtitle.component';
import { BlogPostTocComponent } from './blog-post-toc/blog-post-toc.component';

@NgModule({
  declarations: [
    BlogLayoutComponent,
    BlogPostComponent,
    BlogPostsComponent,
    BlogPostSubtitleComponent,
    BlogPostTocComponent
  ],
    imports: [
        CommonModule,
        BlogRoutingModule,
        MatCardModule,
        MatIconModule,
        SiteCommonModule,
        MatButtonModule,
        MatDividerModule,
        MatTooltipModule
    ]
})
export class BlogModule { }
