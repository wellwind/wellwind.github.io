import { AfterViewInit, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-blog-post-toc',
  templateUrl: './blog-post-toc.component.html',
  styleUrls: ['./blog-post-toc.component.scss']
})
export class BlogPostTocComponent implements OnInit, AfterViewInit {
  @Input() rootElement!: HTMLElement;
  @Input() contentElement!: HTMLElement

  constructor() {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    console.log(this.rootElement, this.contentElement);
  }

}
