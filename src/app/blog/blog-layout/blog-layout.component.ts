import { Component, OnInit } from '@angular/core';
import { findMainContentContainer, scrollTo } from '../../../utils';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-blog-layout',
    templateUrl: './blog-layout.component.html',
    styleUrls: ['./blog-layout.component.scss'],
    standalone: true,
    imports: [RouterOutlet, MatButtonModule, MatIconModule]
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
