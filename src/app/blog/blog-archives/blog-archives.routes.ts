import { Routes } from '@angular/router';
import { BlogArchivesPostsResolve } from './blog-archives-posts-resolve';
import { BlogArchivesComponent } from './blog-archives.component';

const routes: Routes = [
  {
    path: '',
    resolve: { posts: BlogArchivesPostsResolve },
    component: BlogArchivesComponent
  },
  {
    path: 'page/:page',
    resolve: { posts: BlogArchivesPostsResolve },
    component: BlogArchivesComponent
  }
];
export default routes;
