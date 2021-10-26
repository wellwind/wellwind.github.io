import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlogLayoutComponent } from './blog-posts/blog-layout/blog-layout.component';

const routes: Routes = [
  {
    path: '',
    component: BlogLayoutComponent,
    children: [
      {
        path: 'categories',
        loadChildren: () => import('./blog-categories/blog-categories.module').then(m => m.BlogCategoriesModule)
      },
      {
        path: '',
        loadChildren: () => import('./blog-posts/blog-posts.module').then(m => m.BlogPostsModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlogRoutingModule {
}
