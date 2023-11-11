import { AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { PostMetaWithSlug } from '../../../site-common/post-meta.interface';
import { BlogPostSubtitleComponent } from '../../../site-common/blog-post-subtitle/blog-post-subtitle.component';
import { PaginationComponent } from '../../../site-common/pagination/pagination.component';
import { PostDateAsPathPipe } from '../../../site-common/post-date-as-path/post-date-as-path.pipe';
import { UnslugifyPipe } from '../../../site-common/unslugify/unslugify.pipe';
import { SiteMetaService } from '../../../site-common/site-meta.service';
import { getPagePosts } from '../../get-page-posts';

const PAGE_SIZE = 10;

@Component({
  selector: 'app-blog-categories-posts',
  templateUrl: './blog-categories-posts.component.html',
  styleUrls: ['./blog-categories-posts.component.scss'],
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
export class BlogCategoriesPostsComponent implements OnInit {
  categorySlug$ = this.route.paramMap.pipe(
    map((paramMap) => paramMap.get('category-slug'))
  );

  currentPage$ = this.route.paramMap.pipe(
    map((paramMap) => +(paramMap.get('page') || 1))
  );

  categoryPosts$ = this.route.data.pipe(
    map((data) => data.posts as PostMetaWithSlug[])
  );

  categoryPostsCount$ = this.categoryPosts$.pipe(map((posts) => posts.length));

  posts$ = this.currentPage$.pipe(
    switchMap((pageNum) =>
      this.categoryPosts$.pipe(
        map((posts) => getPagePosts(pageNum, PAGE_SIZE, posts))
      )
    )
  );

  totalPage$ = this.categoryPosts$.pipe(
    map((posts) => Math.ceil(Object.keys(posts).length / PAGE_SIZE))
  );

  constructor(
    private route: ActivatedRoute,
    private siteMetaService: SiteMetaService
  ) {}

  ngOnInit(): void {
    this.categorySlug$.subscribe((category) => {
      this.siteMetaService.resetMeta({
        title: `分類：${category}`,
        description: `${category} 相關文章`,
        keywords: [category || ''],
        type: 'website',
      });
    });
  }
}
