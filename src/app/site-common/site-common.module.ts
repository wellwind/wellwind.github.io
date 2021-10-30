import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { BlogPostSubtitleComponent } from './blog-post-subtitle/blog-post-subtitle.component';
import { PostDateAsPathPipe } from './post-date-as-path.pipe';
import { SlugifyPipe } from './slugify.pipe';
import { PaginationComponent } from './pagination/pagination.component';
import { UnslugifyPipe } from './unslugify.pipe';

@NgModule({
  declarations: [
    PostDateAsPathPipe,
    SlugifyPipe,
    UnslugifyPipe,
    PaginationComponent,
    UnslugifyPipe,
    BlogPostSubtitleComponent],
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule
  ],
  exports: [
    PostDateAsPathPipe,
    SlugifyPipe,
    UnslugifyPipe,
    PaginationComponent,
    UnslugifyPipe,
    BlogPostSubtitleComponent
  ]
})
export class SiteCommonModule {
}
