import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { PushModule } from '@rx-angular/template/push';
import { PostDateAsPathModule } from 'src/app/site-common/post-date-as-path/post-date-as-path.module';
import { BlogPostSubtitleModule } from './../../site-common/blog-post-subtitle/blog-post-subtitle.module';
import { PaginationModule } from './../../site-common/pagination/pagination.module';
import { BlogPostsRoutingModule } from './blog-posts-routing.module';
import { BlogPostsComponent } from './blog-posts.component';

@NgModule({
  declarations: [BlogPostsComponent],
  imports: [
    CommonModule,
    BlogPostsRoutingModule,
    BlogPostSubtitleModule,
    PostDateAsPathModule,
    PaginationModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatRippleModule,
    PushModule,
  ],
})
export class BlogPostsModule {}
