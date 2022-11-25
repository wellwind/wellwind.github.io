import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { PushModule } from '@rx-angular/template/push';
import { BlogPostSubtitleComponent } from './blog-post-subtitle/blog-post-subtitle.component';
import { CommentComponent } from './comment/comment.component';
import { LikerCoinComponent } from './liker-coin/liker-coin.component';
import { PaginationComponent } from './pagination/pagination.component';
import { PostDateAsPathPipe } from './post-date-as-path.pipe';
import { SlugifyPipe } from './slugify.pipe';
import { UnslugifyPipe } from './unslugify.pipe';

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
    MatTooltipModule,
    PushModule
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
