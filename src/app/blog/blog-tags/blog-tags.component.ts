import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { PostMetaWithSlug } from '../../post-meta.interface';

@Component({
  selector: 'app-blog-tags',
  templateUrl: './blog-tags.component.html',
  styleUrls: ['./blog-tags.component.scss']
})
export class BlogTagsComponent implements OnInit {

  tags$ = this.route.data.pipe(
    map(data => data.tags as { [key: string]: PostMetaWithSlug[] })
  );

  maxPostsCount$ = this.tags$.pipe(
    map(tags => Math.max(...Object.values(tags).map(posts => posts.length)))
  )

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit(): void {
  }

}
