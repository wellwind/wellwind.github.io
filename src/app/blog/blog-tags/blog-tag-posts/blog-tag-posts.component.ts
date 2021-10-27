import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { PostMetaWithSlug } from '../../../post-meta.interface';
import { getPagePosts } from '../../get-page-posts';

const PAGE_SIZE = 10;

@Component({
  selector: 'app-blog-tag-posts',
  templateUrl: './blog-tag-posts.component.html',
  styleUrls: ['./blog-tag-posts.component.scss']
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

  posts$ = this.currentPage$.pipe(
    switchMap(pageNum => this.tagPosts$.pipe(
      map(posts => getPagePosts(pageNum, PAGE_SIZE, posts))
    ))
  );

  totalPage$ = this.tagPosts$.pipe(
    map((posts) => Math.ceil(Object.keys(posts).length / PAGE_SIZE))
  );

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit(): void {
  }

}
