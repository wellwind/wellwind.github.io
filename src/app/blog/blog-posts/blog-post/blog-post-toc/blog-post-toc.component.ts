import { ContentObserver } from '@angular/cdk/observers';
import { AsyncPipe } from '@angular/common';
import { AfterViewInit, Component, Input, OnDestroy, OnInit, TransferState, makeStateKey } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';
import { PlatformService } from '../../../../../platform.service';
import { findMainContentContainer, scrollTo } from '../../../../../utils';

interface Heading {
  text: string,
  level: number,
  element?: HTMLElement,
  active: boolean
}

const HEADINGS_CACHE_KEY = makeStateKey<Heading[]>('POST_TOC');

@Component({
    selector: 'app-blog-post-toc',
    templateUrl: './blog-post-toc.component.html',
    styleUrls: ['./blog-post-toc.component.scss'],
    standalone: true,
    imports: [AsyncPipe]
})
export class BlogPostTocComponent implements OnInit, AfterViewInit, OnDestroy {
  private _contentElement!: HTMLElement;
  private _contentElement$ = new ReplaySubject<HTMLElement>(1);

  @Input()
  set contentElement(value: HTMLElement) {
    this._contentElement = value;
    this._contentElement$.next(this._contentElement)
  }

  headings$ = this._contentElement$.pipe(
    switchMap(contentElement =>
      this.contentObserver.observe(contentElement)
        .pipe(
          map(() => contentElement),
          startWith(contentElement)
        )
    ),
    map(element => ({ cacheHeadings: this.getCacheHeadings(), element })),
    map(data => {
      if (data.cacheHeadings && data.cacheHeadings.length > 0) {
        if (!this.platformService.isServer) {
          this.removeCacheHeadings()
        }
        return ({ headings: data.cacheHeadings, element: data.element });
      } else {
        const tocHeadings = this.getTocHeadings(data.element);
        if (this.platformService.isServer) {
          this.setCacheHeadings(tocHeadings);
        }
        return ({ headings: tocHeadings, element: data.element });
      }
    }),
    map(data => {
      // client 端重新抓一次 toc
      if (!this.platformService.isServer) {
        return { headings: this.getTocHeadings(data.element), element: data.element };
      }
      return data;
    }),
    switchMap((data) => this.getContentTocHeadings(data.headings, data.element)),
    startWith(this.getCacheHeadings())
  );

  private _intersectionObserver?: IntersectionObserver | null;

  constructor(
    private transferState: TransferState,
    private platformService: PlatformService,
    private contentObserver: ContentObserver) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
  }

  getCacheHeadings() {
    return this.transferState.get<Heading[]>(HEADINGS_CACHE_KEY, []);
  }

  setCacheHeadings(headings: Heading[]) {
    this.transferState.set<Heading[]>(HEADINGS_CACHE_KEY, headings);
  }

  removeCacheHeadings() {
    this.transferState.remove(HEADINGS_CACHE_KEY)
  }

  getContentTocHeadings(headings: Heading[], element: HTMLElement) {
    return new Observable<Heading[]>(subscriber => {
      // 先回傳目前內容
      subscriber.next(headings);

      if (this.platformService.isServer) {
        subscriber.complete();
        return;
      }

      // client 計算要 active 的 element

      const containerElement = element.closest('.mat-drawer-content.main-content');
      let options = {
        root: containerElement,
        rootMargin: '0px',
        threshold: 1.0
      }

      let visibleElements: HTMLElement[] = [];
      if (this._intersectionObserver) {
        this._intersectionObserver.disconnect();
        this._intersectionObserver = null;
      }

      this._intersectionObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            visibleElements = [...visibleElements, entry.target as HTMLElement];
          } else {
            visibleElements = visibleElements.filter(element => element !== entry.target);
          }
        });

        if (visibleElements.length > 0) {
          const visibleElement = visibleElements.sort((a, b) => a.offsetTop - b.offsetTop)[0];
          subscriber.next(headings.map(head => ({
            ...head,
            active: head.element === visibleElement
          })))
        }
      }, options);

      headings.forEach(head => {
        this._intersectionObserver!.observe(head.element!);
      });
    })
  }

  private getTocHeadings(element: HTMLElement) {
    let result: any[] = [];
    element.querySelectorAll('h1,h2,h3,h4,h5,h6').forEach(head => {
      result = [...result, {
        text: head.textContent,
        level: +head.tagName.replace(/h(.)/i, '$1'),
        element: this.platformService.isServer ? null : head,
        active: false
      }]
    });
    return result;
  }

  ngOnDestroy() {
    if (this._intersectionObserver) {
      this._intersectionObserver.disconnect();
    }
  }

  goTo(target: Heading, event: MouseEvent) {
    event.preventDefault();
    const containerElement = findMainContentContainer(this._contentElement);
    if (containerElement && target.element) {
      scrollTo(target.element.offsetTop - 20, containerElement);
    }
  }
}
