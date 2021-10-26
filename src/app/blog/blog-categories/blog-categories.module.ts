import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
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
    MatButtonModule
  ]
})
export class BlogCategoriesModule { }
