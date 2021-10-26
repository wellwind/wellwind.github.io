import { Component, Input, OnInit } from '@angular/core';
import { MarkdownMeta } from 'site-utils';
import { PostMeta } from '../../../post-meta.interface';

@Component({
  selector: 'app-blog-post-subtitle',
  templateUrl: './blog-post-subtitle.component.html',
  styleUrls: ['./blog-post-subtitle.component.scss']
})
export class BlogPostSubtitleComponent implements OnInit {

  @Input() postMeta?: MarkdownMeta | PostMeta;

  constructor() {
  }

  ngOnInit(): void {
  }

}
