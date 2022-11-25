import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { PushModule } from '@rx-angular/template/push';
import { SiteCommonModule } from '../../site-common/site-common.module';

import { BlogCategoriesPostsComponent } from './blog-categories-posts/blog-categories-posts.component';
import { BlogCategoriesRoutingModule } from './blog-categories-routing.module';
import { BlogCategoriesComponent } from './blog-categories.component';

@NgModule({
  declarations: [BlogCategoriesComponent, BlogCategoriesPostsComponent],
  imports: [
    CommonModule,
    BlogCategoriesRoutingModule,
    MatCardModule,
    SiteCommonModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    PushModule,
  ],
})
export class BlogCategoriesModule {}
