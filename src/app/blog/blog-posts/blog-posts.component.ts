import { Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { getRouteParam } from 'src/app/site-common/route-utils';
import { BlogPostSubtitleComponent } from '../../site-common/blog-post-subtitle.component';
import { PaginationComponent } from '../../site-common/pagination.component';
import { PostDateAsPathPipe } from '../../site-common/post-date-as-path.pipe';
import { SitePostService } from '../../site-common/site-post.service';
import { getPagePosts } from '../get-page-posts';

const PAGE_SIZE = 10;

@Component({
  selector: 'app-blog-posts',
  template: `@for (post of posts(); track post.slug) {

    <mat-card appearance="outlined" class="blog-post">
      <mat-card-title class="blog-post-title">
        <a class="text-2xl" [routerLink]="post | postDateAsPath">{{
          post.title
        }}</a>
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
        linkBase="/blog/page"
        [currentPage]="currentPage() || 1"
        [totalPage]="totalPage() || 1"
      ></app-pagination>
    </mat-card> `,
  styles: ``,
  standalone: true,
  imports: [
    MatCardModule,
    RouterLink,
    BlogPostSubtitleComponent,
    MatButtonModule,
    MatIconModule,
    PaginationComponent,
    PostDateAsPathPipe,
  ],
})
export class BlogPostsComponent {
  private sitePostService = inject(SitePostService);

  protected currentPage = getRouteParam(
    (paramMap) => +(paramMap.get('page') || 1),
    1
  );

  protected posts = computed(() => {
    const pageNum = this.currentPage();
    const posts = this.sitePostService.postsMetaWithSlugAndSortDesc();
    return getPagePosts(pageNum, PAGE_SIZE, posts);
  })

  protected totalPage = computed(() =>
    Math.ceil(Object.keys(this.sitePostService.postsMeta() || {}).length / PAGE_SIZE)
  );
}
