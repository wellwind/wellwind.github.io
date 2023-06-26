import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BlogPostTocComponent } from './blog-post-toc/blog-post-toc.component';
import { BlogPostRoutingModule } from './blog-post-routing.module';
import { BlogPostComponent } from './blog-post.component';

@NgModule({
  imports: [
    CommonModule,
    BlogPostRoutingModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatTooltipModule,
    MatRippleModule,
    BlogPostComponent,
    BlogPostTocComponent,
  ],
})
export class BlogPostModule {}
