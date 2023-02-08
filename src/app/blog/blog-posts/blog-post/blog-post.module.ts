import { BlogPostSubtitleModule } from './../../../site-common/blog-post-subtitle/blog-post-subtitle.module';
import { LikerCoinModule } from './../../../site-common/liker-coin/liker-coin.module';
import { SlugifyModule } from './../../../site-common/slugify/slugify.module';
import { PostDateAsPathModule } from 'src/app/site-common/post-date-as-path/post-date-as-path.module';
import { CommentModule } from './../../../site-common/comment/comment.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PushModule } from '@rx-angular/template/push';
import { BlogPostTocComponent } from './blog-post-toc/blog-post-toc.component';
import { BlogPostRoutingModule } from './blog-post-routing.module';
import { BlogPostComponent } from './blog-post.component';

@NgModule({
  declarations: [BlogPostComponent, BlogPostTocComponent],
  imports: [
    CommonModule,
    BlogPostRoutingModule,
    BlogPostSubtitleModule,
    PostDateAsPathModule,
    SlugifyModule,
    CommentModule,
    LikerCoinModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatTooltipModule,
    MatRippleModule,
    PushModule,
  ]
})
export class BlogPostModule { }
