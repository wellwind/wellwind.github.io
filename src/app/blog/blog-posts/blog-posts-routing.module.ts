import { NgModule } from '@angular/core';
import { Route, RouterModule, Routes } from '@angular/router';
import { BlogContentResolve } from './blog-content-resolve';
import { BlogPostComponent } from './blog-post/blog-post.component';
import { BlogPostsComponent } from './blog-posts.component';

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
    component: BlogPostsComponent
  },
  {
    path: 'page/:page',
    component: BlogPostsComponent
  },
  postRoute
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlogPostsRoutingModule {
}