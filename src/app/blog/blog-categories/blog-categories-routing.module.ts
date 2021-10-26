import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlogCategoriesPostsResolve } from './blog-categories-posts-resolve';
import { BlogCategoriesPostsComponent } from './blog-categories-posts/blog-categories-posts.component';
import { BlogCategoriesComponent } from './blog-categories.component';

const routes: Routes = [
  {
    path: ':category-slug',
    resolve: { posts: BlogCategoriesPostsResolve },
    component: BlogCategoriesPostsComponent
  },
  {
    path: ':category-slug/page/:page',
    resolve: { posts: BlogCategoriesPostsResolve },
    component: BlogCategoriesPostsComponent
  },
  {
    path: '',
    component: BlogCategoriesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlogCategoriesRoutingModule { }
