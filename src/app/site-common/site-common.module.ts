import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { RouterModule } from '@angular/router';
import { BlogPostSubtitleComponent } from './blog-post-subtitle/blog-post-subtitle.component';
import { PostDateAsPathPipe } from './post-date-as-path.pipe';
import { SlugifyPipe } from './slugify.pipe';
import { PaginationComponent } from './pagination/pagination.component';
import { UnslugifyPipe } from './unslugify.pipe';
import { CommentComponent } from './comment/comment.component';
import { LikerCoinComponent } from './liker-coin/liker-coin.component';

@NgModule({
  declarations: [
    PostDateAsPathPipe,
    SlugifyPipe,
    UnslugifyPipe,
    PaginationComponent,
    UnslugifyPipe,
    BlogPostSubtitleComponent,
    CommentComponent,
    LikerCoinComponent],
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
    BlogPostSubtitleComponent,
    CommentComponent,
    LikerCoinComponent
  ]
})
export class SiteCommonModule {
}
