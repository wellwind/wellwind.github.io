import { Component, computed } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { getRouteData, getRouteParam } from 'src/app/site-common/route-utils';
import { BlogPostSubtitleComponent } from '../../site-common/blog-post-subtitle.component';
import { PaginationComponent } from '../../site-common/pagination.component';
import { PostDateAsPathPipe } from '../../site-common/post-date-as-path.pipe';
import { PostMetaWithSlug } from '../../site-common/post-meta.interface';
import { getPagePosts } from '../get-page-posts';

const PAGE_SIZE = 10;

@Component({
  selector: 'app-blog-archives',
  template: `
    @for (yearPosts of posts(); track yearPosts.year) {

    <mat-toolbar class="year-header mat-elevation-z4 !mb-2">
      <h1>{{ yearPosts.year }}</h1>
      <h2>年 (共 {{ yearPosts.postCount }} 篇文章)</h2>
    </mat-toolbar>

    @for (post of yearPosts.posts; track post.slug) {

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

    } }

    <mat-card appearance="outlined" class="pagination">
      <app-pagination
        linkBase="/blog/archives/page"
        [currentPage]="currentPage() || 1"
        [totalPage]="totalPage() || 1"
      ></app-pagination>
    </mat-card>
  `,
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
    PostDateAsPathPipe,
  ],
})
export class BlogArchivesComponent {
  protected currentPage = getRouteParam(
    (paramMap) => +(paramMap.get('page') || 1),
    1
  );

  protected totalPosts = getRouteData(
    (data) => data.posts as Array<PostMetaWithSlug>,
    []
  );

  protected yearPostsCount = computed(() => {
    return this.totalPosts().reduce((prev, curr) => {
      const year = curr.date.substr(0, 4);
      if (!prev[year]) {
        prev[year] = 0;
      }
      prev[year] += 1;
      return prev;
    }, {} as { [key: string]: number });
  });

  protected posts = computed(() => {
    const totalPosts = this.totalPosts();
    const pageNum = this.currentPage();
    const pagePosts = getPagePosts(pageNum, PAGE_SIZE, totalPosts);
    const yearPostsCount = this.yearPostsCount();
    return pagePosts.reduce((prev, curr) => {
      const year = curr.date.slice(0, 4);

      let yearPosts = prev.find((item) => item.year === year);
      if (!yearPosts) {
        prev.push({
          year,
          postCount: yearPostsCount[year],
          posts: [curr],
        });
      } else {
        yearPosts.posts.push(curr);
      }

      return prev;
    }, [] as { year: string; postCount: number; posts: PostMetaWithSlug[] }[]);
  });

  protected totalPage = computed(() => {
    return Math.ceil(this.totalPosts().length / PAGE_SIZE);
  });
}
