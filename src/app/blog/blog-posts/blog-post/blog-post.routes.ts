import { Routes } from '@angular/router';
import { BlogContentResolve } from './blog-content-resolve';
import { BlogPostComponent } from './blog-post.component';

const routes: Routes = [
  {
    path: '',
    resolve: { content: BlogContentResolve },
    component: BlogPostComponent,
  },
];
export default routes;
