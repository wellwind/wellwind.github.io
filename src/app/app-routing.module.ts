import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'blog',
    loadChildren: () => import('./blog/blog-routes')
  },
  {
    path: 'query',
    loadChildren: () => import('./query/query.module').then(m => m.QueryModule)
  },
  {
    path: '',
    redirectTo: 'blog',
    pathMatch: 'full',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabledBlocking'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
