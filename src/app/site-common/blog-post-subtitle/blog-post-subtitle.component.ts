import { Component, Input, OnInit } from '@angular/core';
import { MarkdownMeta } from 'site-utils';
import { PostMeta } from '../../post-meta.interface';
import { SlugifyPipe } from '../slugify/slugify.pipe';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { NgIf, NgFor } from '@angular/common';

@Component({
    selector: 'app-blog-post-subtitle',
    templateUrl: './blog-post-subtitle.component.html',
    styleUrls: ['./blog-post-subtitle.component.scss'],
    standalone: true,
    imports: [NgIf, MatIconModule, NgFor, RouterLink, SlugifyPipe]
})
export class BlogPostSubtitleComponent implements OnInit {

  @Input() postMeta?: MarkdownMeta | PostMeta;

  constructor() {
  }

  ngOnInit(): void {
  }

}
