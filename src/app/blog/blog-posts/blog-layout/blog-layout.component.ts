import { Component, OnInit } from '@angular/core';
import { findMainContentContainer, scrollTo } from '../../../../utils';

@Component({
  selector: 'app-blog-layout',
  templateUrl: './blog-layout.component.html',
  styleUrls: ['./blog-layout.component.scss']
})
export class BlogLayoutComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  goTop(contentElement: HTMLElement) {
    if (contentElement) {
      const containerElement = findMainContentContainer(contentElement);
      if (containerElement) {
        scrollTo(0, containerElement);
      }
    }
  }
}
