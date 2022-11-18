import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
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
        MatTooltipModule,
        MatChipsModule
    ]
})
export class BlogPostsModule {
}
