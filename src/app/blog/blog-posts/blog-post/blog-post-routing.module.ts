import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlogContentResolve } from './blog-content-resolve';
import { BlogPostComponent } from './blog-post.component';

const routes: Routes = [
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
                resolve: { content: BlogContentResolve },
                component: BlogPostComponent,
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
export class BlogPostRoutingModule {}
