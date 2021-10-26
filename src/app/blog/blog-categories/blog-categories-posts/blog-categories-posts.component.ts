import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { PostMetaWithSlug } from '../../../post-meta.interface';

@Component({
  selector: 'app-blog-categories-posts',
  templateUrl: './blog-categories-posts.component.html',
  styleUrls: ['./blog-categories-posts.component.scss']
})
export class BlogCategoriesPostsComponent implements OnInit {

  posts$ = this.route.data.pipe(
    map(data => data.posts as PostMetaWithSlug[])
  )

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit(): void {
  }

}
