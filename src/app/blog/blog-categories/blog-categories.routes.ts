import { Routes } from '@angular/router';
import { BlogCategoriesPostsResolve } from './blog-categories-posts-resolve';
import { BlogCategoriesPostsComponent } from './blog-categories-posts.component';
import { BlogCategoriesResolve } from './blog-categories-resolve';
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
    resolve: { categories: BlogCategoriesResolve },
    component: BlogCategoriesComponent
  }
];
export default routes;
