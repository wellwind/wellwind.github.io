import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { descend, prop, sortWith } from 'ramda';
import { combineLatest } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { PostMeta } from '../../post-meta.interface';
import { SitePostService } from '../../site-post.service';

const PAGE_SIZE = 10;

interface PostMetaWithSlug extends PostMeta {
  slug: string;
}

const getPagePosts = (pageNum: number, pageSize: number, item: PostMetaWithSlug[]) =>
  item.slice((pageNum - 1) * pageSize, (pageNum - 1) * pageSize + pageSize);

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
    switchMap(pageNum => this.sitePostService.postsMeta$.pipe(
      map(postsMeta => Object.keys(postsMeta).map(key => ({ ...postsMeta[key], slug: key }))),
      map(posts => sortWith([descend(prop('date'))], posts)),
      map(posts => getPagePosts(pageNum, PAGE_SIZE, posts)),
    ))
  );

  totalPage$ =  this.sitePostService.postsMeta$.pipe(
    map((posts) => Math.ceil(Object.keys(posts).length / PAGE_SIZE))
  );

  constructor(private sitePostService: SitePostService, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
  }

}
