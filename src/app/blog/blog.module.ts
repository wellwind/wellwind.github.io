import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { SiteCommonModule } from '../site-common/site-common.module';

import { BlogRoutingModule } from './blog-routing.module';
import { BlogLayoutComponent } from './blog-layout/blog-layout.component';
import { BlogPostComponent } from './blog-post/blog-post.component';
import { BlogPostsComponent } from './blog-posts/blog-posts.component';

@NgModule({
  declarations: [
    BlogLayoutComponent,
    BlogPostComponent,
    BlogPostsComponent
  ],
    imports: [
        CommonModule,
        BlogRoutingModule,
        MatCardModule,
        MatIconModule,
        SiteCommonModule,
        MatButtonModule
    ]
})
export class BlogModule { }
