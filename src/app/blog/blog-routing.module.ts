import { NgModule } from '@angular/core';
import { Route, RouterModule, Routes } from '@angular/router';
import { BlogContentResolve } from './blog-content-resolve';
import { BlogLayoutComponent } from './blog-layout/blog-layout.component';
import { BlogPostComponent } from './blog-post/blog-post.component';

const postRoute: Route = {
  path: ':yyyy',
  children: [
    {
      path: ':mm',
      children: [
        {
          path: ':dd',
          children: [
            {
              path: ':slug',
              resolve: { content: BlogContentResolve },
              component: BlogPostComponent
            }
          ]
        }
      ]
    }
  ]
}
const routes: Routes = [
  {
    path: '',
    component: BlogLayoutComponent,
    children: [
      postRoute
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlogRoutingModule {
}
