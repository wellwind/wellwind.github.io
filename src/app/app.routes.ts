import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'blog',
    loadChildren: () => import('./blog/blog.routes')
  },
  {
    path: 'query',
    loadChildren: () => import('./query/query.routes')
  },
  {
    path: '',
    redirectTo: 'blog',
    pathMatch: 'full',
  }
];
