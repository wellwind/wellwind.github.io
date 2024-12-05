import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { PostMetaWithSlug } from 'src/app/site-common/post-meta.interface';
import { getRouteData, getRouteParam } from 'src/app/site-common/route-utils';
import { BlogPostSubtitleComponent } from '../../site-common/blog-post-subtitle.component';
import { PaginationComponent } from '../../site-common/pagination.component';
import { PostDateAsPathPipe } from '../../site-common/post-date-as-path.pipe';
import { SiteMetaService } from '../../site-common/site-meta.service';
import { UnslugifyPipe } from '../../site-common/unslugify.pipe';
import { getPagePosts } from '../get-page-posts';

const PAGE_SIZE = 10;

@Component({
    selector: 'app-blog-categories-posts',
    template: `
    <mat-toolbar class="categories-header mat-elevation-z4 !mb-2">
      <h1>{{ categorySlug() || '' | unslugify }}</h1>
      <h2>分類 (共 {{ categoryPostsCount() }} 篇文章)</h2>
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
        linkBase="/blog/categories/{{ categorySlug() }}/page"
        [currentPage]="currentPage() || 1"
        [totalPage]="totalPage() || 1"
      ></app-pagination>
    </mat-card>
  `,
    styles: ``,
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
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlogCategoriesPostsComponent {
  private siteMetaService = inject(SiteMetaService);

  protected categorySlug = getRouteParam(
    (paramMap) => paramMap.get('category-slug'),
    ''
  );
  protected currentPage = getRouteParam(
    (paramMap) => +(paramMap.get('page') || 1),
    1
  );
  protected categoryPosts = getRouteData(
    (data) => data.posts as Array<PostMetaWithSlug>,
    []
  );
  protected categoryPostsCount = computed(() => this.categoryPosts().length);
  protected posts = computed(() =>
    getPagePosts(this.currentPage(), PAGE_SIZE, this.categoryPosts())
  );
  protected totalPage = computed(() =>
    Math.ceil(this.categoryPostsCount() / PAGE_SIZE)
  );

  private _updateMetaEffect = effect(() => {
    const category = this.categorySlug();
    this.siteMetaService.resetMeta({
      title: `分類：${category}`,
      description: `${category} 相關文章`,
      keywords: [category || ''],
      type: 'website',
    });
  });
}
