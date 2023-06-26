import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { SitePostService } from '../../site-post.service';
import { getPagePosts } from '../get-page-posts';
import { RxPush } from '@rx-angular/template/push';
import { PostDateAsPathPipe } from '../../site-common/post-date-as-path/post-date-as-path.pipe';
import { PaginationComponent } from '../../site-common/pagination/pagination.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { BlogPostSubtitleComponent } from '../../site-common/blog-post-subtitle/blog-post-subtitle.component';
import { MatCardModule } from '@angular/material/card';
import { NgFor } from '@angular/common';

const PAGE_SIZE = 10;

@Component({
    selector: 'app-blog-posts',
    templateUrl: './blog-posts.component.html',
    styleUrls: ['./blog-posts.component.scss'],
    standalone: true,
    imports: [NgFor, MatCardModule, RouterLink, BlogPostSubtitleComponent, MatButtonModule, MatIconModule, PaginationComponent, PostDateAsPathPipe, RxPush]
})
export class BlogPostsComponent implements OnInit {

  currentPage$ = this.route.paramMap.pipe(
    map(paramMap => +(paramMap.get('page') || 1))
  );

  posts$ = this.currentPage$.pipe(
    switchMap(pageNum => this.sitePostService.postsMetaWithSlugAndSortDesc$.pipe(
      map(posts => getPagePosts(pageNum, PAGE_SIZE, posts)),
    ))
  );

  totalPage$ =  this.sitePostService.postsMeta$.pipe(
    map((posts) => Math.ceil(Object.keys(posts || {}).length / PAGE_SIZE))
  );

  constructor(private sitePostService: SitePostService, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
  }

}
