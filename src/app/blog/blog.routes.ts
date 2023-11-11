import { Routes } from '@angular/router';
import { BlogLayoutComponent } from './blog-layout.component';

const routes: Routes = [
  {
    path: '',
    component: BlogLayoutComponent,
    children: [
      {
        path: 'archives',
        loadChildren: () => import('./blog-archives/blog-archives.routes'),
      },
      {
        path: 'categories',
        loadChildren: () => import('./blog-categories/blog-categories.routes'),
      },
      {
        path: 'tags',
        loadChildren: () => import('./blog-tags/blog-tags.routes'),
      },
      {
        path: '',
        loadChildren: () =>
          import('./blog-posts/blog-posts.routes')
      },
    ],
  },
];

export default routes;
