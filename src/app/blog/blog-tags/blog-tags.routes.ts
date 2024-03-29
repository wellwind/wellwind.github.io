import { Routes } from '@angular/router';
import { BlogTagPostsComponent } from './blog-tag-posts.component';
import { BlogTagsPostsResolve } from './blog-tags-posts-resolve';
import { BlogTagsResolve } from './blog-tags-resolve';
import { BlogTagsComponent } from './blog-tags.component';

const routes: Routes = [
  {
    path: ':tag-slug',
    resolve: { posts: BlogTagsPostsResolve },
    component: BlogTagPostsComponent
  },
  {
    path: ':tag-slug/page/:page',
    resolve: { posts: BlogTagsPostsResolve },
    component: BlogTagPostsComponent
  },
  {
    path: '',
    resolve: { tags: BlogTagsResolve},
    component: BlogTagsComponent
  }
];
export default routes;
