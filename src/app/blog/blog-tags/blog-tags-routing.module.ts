import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlogTagsResolve } from './blog-tags-resolve';
import { BlogTagsComponent } from './blog-tags.component';

const routes: Routes = [
  {
    path: '',
    resolve: { tags: BlogTagsResolve},
    component: BlogTagsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlogTagsRoutingModule { }
