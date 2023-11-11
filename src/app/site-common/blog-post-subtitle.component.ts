import { Component, Input, OnInit } from '@angular/core';
import { MarkdownMeta } from 'site-utils';
import { PostMeta } from './post-meta.interface';
import { SlugifyPipe } from './slugify.pipe';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-blog-post-subtitle',
  template: `
    @if (postMeta) {

    <span class="blog-post-published">
      <mat-icon>date_range</mat-icon>
      <span>{{ postMeta.date.slice(0, 10) }}</span>
    </span>

    @if ((postMeta.categories || []).length > 0) {

    <span class="blog-post-categories">
      <mat-icon>folder_open</mat-icon>
      @for (category of postMeta.categories; track category; let last = $last) {

      <a
        class="blog-post-category-link"
        [routerLink]="['/blog/categories', category | slugify]"
        >{{ category }}</a
      >
      @if (!last) {
      <span class="sub-divider px-1">|</span>
      } }
    </span>

    } }
  `,
  styles: `
    :host {
  display: flex;
  align-items: center;

  .blog-post-categories {
    font-size: 18px;
    line-height: 24px;
  }

  @media (max-width: 599.98px) {
    flex-direction: column;
    align-items: flex-start;
    .blog-post-categories {
      margin-left: 0;
    }
  }
}
`,
  standalone: true,
  imports: [MatIconModule, RouterLink, SlugifyPipe],
})
export class BlogPostSubtitleComponent {
  @Input() postMeta?: MarkdownMeta | PostMeta;
}
