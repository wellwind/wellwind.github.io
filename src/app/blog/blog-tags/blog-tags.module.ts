import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { SiteCommonModule } from '../../site-common/site-common.module';

import { BlogTagsRoutingModule } from './blog-tags-routing.module';
import { BlogTagsComponent } from './blog-tags.component';
import { BlogPostTagSizePipe } from './blog-post-tag-size.pipe';


@NgModule({
  declarations: [
    BlogTagsComponent,
    BlogPostTagSizePipe
  ],
  imports: [
    CommonModule,
    SiteCommonModule,
    BlogTagsRoutingModule,
    MatCardModule
  ]
})
export class BlogTagsModule { }
