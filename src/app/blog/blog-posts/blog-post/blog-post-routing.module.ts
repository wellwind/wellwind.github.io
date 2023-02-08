import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlogContentResolve } from './blog-content-resolve';
import { BlogPostComponent } from './blog-post.component';

const routes: Routes = [
  {
    path: '',
    resolve: { content: BlogContentResolve },
    component: BlogPostComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BlogPostRoutingModule {}
