import { BlogPostSubtitleModule } from './../../site-common/blog-post-subtitle/blog-post-subtitle.module';
import { UnslugifyModule } from './../../site-common/unslugify/unslugify.module';
import { PostDateAsPathModule } from '../../site-common/post-date-as-path/post-date-as-path.module';
import { PaginationModule } from './../../site-common/pagination/pagination.module';
import { SlugifyModule } from './../../site-common/slugify/slugify.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { PushModule } from '@rx-angular/template/push';
import { BlogCategoriesPostsComponent } from './blog-categories-posts/blog-categories-posts.component';
import { BlogCategoriesRoutingModule } from './blog-categories-routing.module';
import { BlogCategoriesComponent } from './blog-categories.component';

@NgModule({
  declarations: [BlogCategoriesComponent, BlogCategoriesPostsComponent],
  imports: [
    CommonModule,
    BlogCategoriesRoutingModule,
    BlogPostSubtitleModule,
    SlugifyModule,
    UnslugifyModule,
    PaginationModule,
    PostDateAsPathModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    PushModule,
  ],
})
export class BlogCategoriesModule {}
