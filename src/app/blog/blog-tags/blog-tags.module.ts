import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BlogPostTagSizePipe } from './blog-post-tag-size.pipe';
import { BlogTagPostsComponent } from './blog-tag-posts/blog-tag-posts.component';
import { BlogTagsRoutingModule } from './blog-tags-routing.module';
import { BlogTagsComponent } from './blog-tags.component';

@NgModule({
  imports: [
    CommonModule,
    BlogTagsRoutingModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    BlogTagsComponent,
    BlogPostTagSizePipe,
    BlogTagPostsComponent,
  ],
})
export class BlogTagsModule {}
