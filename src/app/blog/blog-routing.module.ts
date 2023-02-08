import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlogLayoutComponent } from './blog-layout/blog-layout.component';

const routes: Routes = [
  {
    path: '',
    component: BlogLayoutComponent,
    children: [
      {
        path: 'archives',
        loadChildren: () => import('./blog-archives/blog-archives.module').then(m => m.BlogArchivesModule)
      },
      {
        path: 'categories',
        loadChildren: () => import('./blog-categories/blog-categories.module').then(m => m.BlogCategoriesModule)
      },
      {
        path: 'tags',
        loadChildren: () => import('./blog-tags/blog-tags.module').then(m => m.BlogTagsModule)
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
