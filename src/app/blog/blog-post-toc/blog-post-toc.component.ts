import { isPlatformServer } from '@angular/common';
import { AfterViewInit, Component, Inject, Input, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { findMainContentContainer } from '../../../utils/find-main-content-container';
import { scrollTo } from '../../../utils/scroll-to';

@Component({
  selector: 'app-blog-post-toc',
  templateUrl: './blog-post-toc.component.html',
  styleUrls: ['./blog-post-toc.component.scss']
})
export class BlogPostTocComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() contentElement!: HTMLElement

  headings: { text: string, level: number, element: HTMLElement, active: boolean }[] = [];
  intersectionObserver?: IntersectionObserver;

  constructor(@Inject(PLATFORM_ID) private platformId: any) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    if (isPlatformServer(this.platformId)) {
      return;
    }

    setTimeout(() => {
      this.setTocScrollSpy();
    });
  }

  private setTocScrollSpy() {
    let result: any[] = [];
    this.contentElement.querySelectorAll('h1,h2,h3,h4,h5,h6').forEach(head => {
      result = [...result, {
        text: head.textContent,
        level: +head.tagName.replace(/h(.)/i, '$1'),
        element: head,
        active: false
      }]
    });
    this.headings = result;

    const containerElement = this.contentElement.closest('.mat-drawer-content.main-content');
    let options = {
      root: containerElement,
      rootMargin: '0px',
      threshold: 1.0
    }

    let visibleElements: HTMLElement[] = [];
    this.intersectionObserver = new IntersectionObserver(entries => {

      entries.forEach(entry => {
        if (entry.isIntersecting) {
          visibleElements = [...visibleElements, entry.target as HTMLElement];
        } else {
          visibleElements = visibleElements.filter(element => element !== entry.target);
        }
      });

      if (visibleElements.length > 0) {
        const visibleElement = visibleElements.sort((a, b) => a.offsetTop - b.offsetTop)[0];
        this.headings = this.headings.map(head => ({
          ...head,
          active: head.element === visibleElement
        }))
      }
    }, options);

    this.headings.forEach(head => {
      this.intersectionObserver!.observe(head.element);
    });
  }

  ngOnDestroy() {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
  }

  goTo(target: { text: string; level: number; element: HTMLElement; active: boolean }, event: MouseEvent) {
    event.preventDefault();
    const containerElement = findMainContentContainer(this.contentElement);
    if (containerElement) {
      scrollTo(target.element.offsetTop - 20, containerElement);
    }
  }
}
