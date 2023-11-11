import { AsyncPipe } from '@angular/common';
import { Component, computed, effect, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { getRouteData, getRouteParam } from 'src/app/site-common/route-utils';
import { BlogPostSubtitleComponent } from '../../site-common/blog-post-subtitle/blog-post-subtitle.component';
import { PaginationComponent } from '../../site-common/pagination/pagination.component';
import { PostDateAsPathPipe } from '../../site-common/post-date-as-path/post-date-as-path.pipe';
import { PostMetaWithSlug } from '../../site-common/post-meta.interface';
import { SiteMetaService } from '../../site-common/site-meta.service';
import { UnslugifyPipe } from '../../site-common/unslugify/unslugify.pipe';
import { getPagePosts } from '../get-page-posts';

const PAGE_SIZE = 10;

@Component({
  selector: 'app-blog-tag-posts',
  template: `<mat-toolbar class="tags-header mat-elevation-z4 !mb-2">
      <h1>{{ (tagSlug() || '') | unslugify }}</h1>
      <h2>標籤 (共 {{ tagPostsCount() }} 篇文章)</h2>
    </mat-toolbar>

    @for (post of posts(); track post.slug) {

    <mat-card appearance="outlined" class="blog-post">
      <mat-card-title class="blog-post-title">
        <a [routerLink]="post | postDateAsPath">{{ post.title }}</a>
      </mat-card-title>

      <mat-card-subtitle class="blog-post-subtitle">
        <app-blog-post-subtitle [postMeta]="post"></app-blog-post-subtitle>
      </mat-card-subtitle>

      <mat-card-content class="blog-post-content">
        <div [innerHTML]="post.summary"></div>
      </mat-card-content>

      <mat-card-footer>
        <a
          class="read-more"
          [routerLink]="post | postDateAsPath"
          mat-raised-button
          color="primary"
        >
          <mat-icon>read_more</mat-icon>
          <span>繼續閱讀</span>
        </a>
      </mat-card-footer>
    </mat-card>

    }

    <mat-card appearance="outlined" class="pagination">
      <app-pagination
        linkBase="/blog/tags/{{ tagSlug() }}/page"
        [currentPage]="(currentPage()) || 1"
        [totalPage]="(totalPage()) || 1"
      ></app-pagination>
    </mat-card> `,
  styles: ``,
  standalone: true,
  imports: [
    MatToolbarModule,
    MatCardModule,
    RouterLink,
    BlogPostSubtitleComponent,
    MatButtonModule,
    MatIconModule,
    PaginationComponent,
    UnslugifyPipe,
    PostDateAsPathPipe,
    AsyncPipe,
  ],
})
export class BlogTagPostsComponent {
  private siteMetaService = inject(SiteMetaService);

  protected tagSlug = getRouteParam((paramMap) => paramMap.get('tag-slug'), '');
  protected currentPage = getRouteParam((paramMap) => +(paramMap.get('page') || 1), 1);
  protected tagPosts = getRouteData((data) => data.posts as Array<PostMetaWithSlug>, []);
  protected tagPostsCount = computed(() => this.tagPosts().length);
  protected posts = computed(() =>
    getPagePosts(this.currentPage(), PAGE_SIZE, this.tagPosts())
  );
  protected totalPage = computed(() => Math.ceil(this.tagPostsCount() / PAGE_SIZE));

  private updateMetaEffect = effect(() => {
    this.siteMetaService.resetMeta({
      title: `標籤：${this.tagSlug()}`,
      description: `${this.tagSlug()} 相關文章`,
      keywords: [this.tagSlug() || ''],
      type: 'website',
    });
  });
}
