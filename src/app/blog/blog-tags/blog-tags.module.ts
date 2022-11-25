import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { PushModule } from '@rx-angular/template/push';
import { SiteCommonModule } from '../../site-common/site-common.module';

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
    SiteCommonModule,
    BlogTagsRoutingModule,
    MatCardModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    PushModule
  ]
})
export class BlogTagsModule { }
