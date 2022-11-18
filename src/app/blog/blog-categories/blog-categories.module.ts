import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SiteCommonModule } from '../../site-common/site-common.module';

import { BlogCategoriesRoutingModule } from './blog-categories-routing.module';
import { BlogCategoriesComponent } from './blog-categories.component';
import { BlogCategoriesPostsComponent } from './blog-categories-posts/blog-categories-posts.component';


@NgModule({
  declarations: [BlogCategoriesComponent, BlogCategoriesPostsComponent],
    imports: [
        CommonModule,
        BlogCategoriesRoutingModule,
        MatCardModule,
        SiteCommonModule,
        MatIconModule,
        MatButtonModule,
        MatToolbarModule
    ]
})
export class BlogCategoriesModule { }
