import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { PostMetaWithSlug } from '../../post-meta.interface';
import { getPagePosts } from '../get-page-posts';

const PAGE_SIZE = 10;

@Component({
  selector: 'app-blog-archives',
  templateUrl: './blog-archives.component.html',
  styleUrls: ['./blog-archives.component.scss']
})
export class BlogArchivesComponent implements OnInit {

  currentPage$ = this.route.paramMap.pipe(
    map(paramMap => +(paramMap.get('page') || 1))
  );

  totalPosts$ = this.route.data.pipe(
    map(data => data.posts as PostMetaWithSlug[])
  );

  yearPostsCount$ = this.totalPosts$.pipe(
    map(posts => posts.reduce((prev, curr) => {
      const year = curr.date.substr(1, 4);
      if (!prev[year]) {
        prev[year] = 0;
      }
      prev[year] += 1;
      return prev;
    }, {} as { [key: string]: number }))
  );

  posts$ = this.currentPage$.pipe(
    switchMap(pageNum => this.totalPosts$
      .pipe(
        map(posts => getPagePosts(pageNum, PAGE_SIZE, posts))
      )),
    switchMap(posts => this.yearPostsCount$
      .pipe(
        map(yearPostsCount => posts.reduce((prev, curr) => {
          const year = curr.date.slice(0, 4);

          let yearPosts = prev.find(item => item.year === year);
          if (!yearPosts) {
            prev.push({ year, postCount: yearPostsCount[year], posts: [curr] })
          } else {
            yearPosts.posts.push(curr);
          }

          return prev;
        }, [] as { year: string, postCount: number, posts: PostMetaWithSlug[] }[]))
      )
    )
  );

  totalPage$ = this.totalPosts$.pipe(
    map((posts) => Math.ceil(Object.keys(posts).length / PAGE_SIZE))
  );

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit(): void {
  }
}