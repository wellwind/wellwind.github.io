import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'blog',
        loadChildren: () => import('../blog/blog.module').then(m => m.BlogModule)
      },
      {
        path: 'query',
        loadChildren: () => import('../query/query.module').then(m => m.QueryModule)
      },
      {
        path: '',
        redirectTo: 'blog',
        pathMatch: 'full',
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule {
}
