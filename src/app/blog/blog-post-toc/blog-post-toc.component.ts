import { isPlatformServer } from '@angular/common';
import { AfterViewInit, Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-blog-post-toc',
  templateUrl: './blog-post-toc.component.html',
  styleUrls: ['./blog-post-toc.component.scss']
})
export class BlogPostTocComponent implements OnInit, AfterViewInit {
  @Input() rootElement!: HTMLElement;
  @Input() contentElement!: HTMLElement

  headings: { text: string, level: number, element: HTMLElement }[] = [];

  constructor(@Inject(PLATFORM_ID) private platformId: any) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    if (isPlatformServer(this.platformId)) {
      return;
    }
    let result: any[] = [];
    this.contentElement.querySelectorAll('h1,h2,h3,h4,h5,h6').forEach(head => {
      result = [...result, {
        text: head.textContent,
        level: +head.tagName.replace(/h(.)/i, '$1'),
        element: head
      }]
    });
    this.headings = result;
  }

}
