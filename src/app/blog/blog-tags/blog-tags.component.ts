import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs/operators';
import { PostMetaWithSlug } from '../../post-meta.interface';
import { SiteMetaService } from '../../site-meta.service';
import { BlogPostTagSizePipe } from './blog-post-tag-size.pipe';
import { PushModule } from '@rx-angular/template/push';
import { SlugifyPipe } from '../../site-common/slugify/slugify.pipe';
import { NgFor, NgIf, KeyValuePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
    selector: 'app-blog-tags',
    templateUrl: './blog-tags.component.html',
    styleUrls: ['./blog-tags.component.scss'],
    standalone: true,
    imports: [MatCardModule, NgFor, NgIf, RouterLink, KeyValuePipe, SlugifyPipe, PushModule, BlogPostTagSizePipe]
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
