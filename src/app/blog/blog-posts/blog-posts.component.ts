import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { SitePostService } from '../../site-post.service';
import { getPagePosts } from '../get-page-posts';

const PAGE_SIZE = 10;

@Component({
  selector: 'app-blog-posts',
  templateUrl: './blog-posts.component.html',
  styleUrls: ['./blog-posts.component.scss']
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
