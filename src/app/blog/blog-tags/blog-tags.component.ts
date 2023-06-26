import { KeyValuePipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RxPush } from '@rx-angular/template/push';
import { map } from 'rxjs/operators';
import { PostMetaWithSlug } from '../../post-meta.interface';
import { SlugifyPipe } from '../../site-common/slugify/slugify.pipe';
import { SiteMetaService } from '../../site-meta.service';
import { BlogPostTagSizePipe } from './blog-post-tag-size.pipe';

@Component({
    selector: 'app-blog-tags',
    templateUrl: './blog-tags.component.html',
    styleUrls: ['./blog-tags.component.scss'],
    standalone: true,
    imports: [MatCardModule, NgFor, NgIf, RouterLink, KeyValuePipe, SlugifyPipe, RxPush, BlogPostTagSizePipe]
})
export class BlogTagsComponent implements OnInit {

  tags$ = this.route.data.pipe(
    map(data => data.tags as { [key: string]: PostMetaWithSlug[] })
  );

  maxPostsCount$ = this.tags$.pipe(
    map(tags => Math.max(...Object.values(tags).map(posts => posts.length)))
  )

  constructor(private route: ActivatedRoute, private siteMetaService: SiteMetaService) {
  }

  ngOnInit(): void {
    this.siteMetaService.resetMeta({
      title: '標籤',
      description: '顯示所有標籤',
      keywords: [''],
      type: 'website'
    });
  }

}
