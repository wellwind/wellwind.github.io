import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlogContentResolve } from './blog-post/blog-content-resolve';
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
                loadChildren: () =>
                  import('./blog-post/blog-post.module').then(
                    (m) => m.BlogPostModule
                  ),
              },
            ],
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BlogPostsRoutingModule {}
