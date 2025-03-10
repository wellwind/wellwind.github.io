import { Routes } from '@angular/router';
import { BlogPostsComponent } from './blog-posts.component';

const routes: Routes = [
  {
    path: '',
    component: BlogPostsComponent,
  },
  {
    path: 'page/:page',
    component: BlogPostsComponent,
  },
  {
    path: ':yyyy/:mm/:dd/:slug',
    loadChildren: () => import('./blog-post/blog-post.routes'),
  },
];
export default routes;
