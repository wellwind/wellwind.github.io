import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { PostMetaWithSlug } from '../../../post-meta.interface';
import { SiteMetaService } from '../../../site-meta.service';
import { getPagePosts } from '../../get-page-posts';
import { PushModule } from '@rx-angular/template/push';
import { PostDateAsPathPipe } from '../../../site-common/post-date-as-path/post-date-as-path.pipe';
import { UnslugifyPipe } from '../../../site-common/unslugify/unslugify.pipe';
import { PaginationComponent } from '../../../site-common/pagination/pagination.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { BlogPostSubtitleComponent } from '../../../site-common/blog-post-subtitle/blog-post-subtitle.component';
import { MatCardModule } from '@angular/material/card';
import { NgFor } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';

const PAGE_SIZE = 10;

@Component({
    selector: 'app-blog-tag-posts',
    templateUrl: './blog-tag-posts.component.html',
    styleUrls: ['./blog-tag-posts.component.scss'],
    standalone: true,
    imports: [MatToolbarModule, NgFor, MatCardModule, RouterLink, BlogPostSubtitleComponent, MatButtonModule, MatIconModule, PaginationComponent, UnslugifyPipe, PostDateAsPathPipe, PushModule]
})
export class BlogTagPostsComponent implements OnInit {
  tagSlug$ = this.route.paramMap.pipe(
    map(paramMap => paramMap.get('tag-slug'))
  );

  currentPage$ = this.route.paramMap.pipe(
    map(paramMap => +(paramMap.get('page') || 1))
  );

  tagPosts$ = this.route.data.pipe(
    map(data => data.posts as PostMetaWithSlug[])
  );

  tagPostsCount$ = this.tagPosts$.pipe(
    map(posts => posts.length)
  );

  posts$ = this.currentPage$.pipe(
    switchMap(pageNum => this.tagPosts$.pipe(
      map(posts => getPagePosts(pageNum, PAGE_SIZE, posts))
    ))
  );

  totalPage$ = this.tagPosts$.pipe(
    map((posts) => Math.ceil(Object.keys(posts).length / PAGE_SIZE))
  );

  constructor(private route: ActivatedRoute, private siteMetaService: SiteMetaService) {
  }

  ngOnInit(): void {
    this.tagSlug$.subscribe(tag => {
      this.siteMetaService.resetMeta({
        title: `標籤：${tag}`,
        description: `${tag} 相關文章`,
        keywords: [tag || ''],
        type: 'website'
      });
    });
  }

}
