import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { PostMetaWithSlug } from '../../../post-meta.interface';
import { getPagePosts } from '../../get-page-posts';

const PAGE_SIZE = 10;

@Component({
  selector: 'app-blog-categories-posts',
  templateUrl: './blog-categories-posts.component.html',
  styleUrls: ['./blog-categories-posts.component.scss']
})
export class BlogCategoriesPostsComponent implements OnInit {

  categorySlug$ = this.route.paramMap.pipe(
    map(paramMap => paramMap.get('category-slug'))
  );

  currentPage$ = this.route.paramMap.pipe(
    map(paramMap => +(paramMap.get('page') || 1))
  );

  categoryPosts$ = this.route.data.pipe(
    map(data => data.posts as PostMetaWithSlug[])
  );

  posts$ = this.currentPage$.pipe(
    switchMap(pageNum => this.categoryPosts$.pipe(
      map(posts => getPagePosts(pageNum, PAGE_SIZE, posts))
    ))
  );

  totalPage$ = this.categoryPosts$.pipe(
    map((posts) => Math.ceil(Object.keys(posts).length / PAGE_SIZE))
  );

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit(): void {
  }

}
