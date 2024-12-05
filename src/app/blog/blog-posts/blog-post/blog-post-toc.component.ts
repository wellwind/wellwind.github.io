import { ContentObserver } from '@angular/cdk/observers';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  TransferState,
  inject,
  makeStateKey,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable, ReplaySubject, map, startWith, switchMap } from 'rxjs';
import { PlatformService } from '../../../site-common/platform.service';
import { findMainContentContainer, scrollTo } from '../../../../utils';

interface Heading {
  text: string;
  level: number;
  element?: HTMLElement;
  active: boolean;
}

const HEADINGS_CACHE_KEY = makeStateKey<Heading[]>('POST_TOC');

@Component({
    selector: 'app-blog-post-toc',
    template: `<div class="toc-list flex flex-col">
      <div
        class="toc-item level0 ml-2 pl-2 font-extrabold border-solid border-0 border-l-4 border-l-[color:var(--toc-indicator-color)] text-[color:var(--toc-header-color)]"
      >
        文章大綱
      </div>
      @for (head of headings(); track head.level) {
      <div
        [class.!border-l-[color:var(--toc-indicator-focus-color)]]="head.active"
        [class.!text-[color:var(--toc-indicator-focus-color)]]="head.active"
        class="toc-item level{{
          head.level
        }} transition-all text-sm leading-7 ml-2 border-solid border-0 border-l-4 border-l-[color:var(--toc-indicator-color)]"
      >
        <a
          href="#"
          (click)="goTo(head, $event)"
          [class.!text-[color:var(--toc-indicator-focus-color)]]="head.active"
          class="transition-all no-underline text-[color:var(--toc-indicator-color)] hover:text-[color:var(--toc-indicator-focus-color)]"
        >
          {{ head.text }}
        </a>
      </div>
      }
    </div>
    <span
      class="hidden !border-l-[color:var(--toc-indicator-focus-color)] !text-[color:var(--toc-indicator-focus-color)]"
    ></span> `,
    styles: `
    :host {
      display: block;
      position: fixed;
      margin: 0 24px;
      height: calc(100vh - 64px - 64px - 32px - 20px);
      overflow: scroll;

      &::-webkit-scrollbar {
        height: 4px;
        width: 4px;
      }

      &::-webkit-scrollbar-thumb {
        background: rgba(0, 0, 0, 0.26);
      }

      &::-webkit-scrollbar-corner {
        background: transparent;
      }
    }

    .toc-list {
      .toc-item {
        @for $i from 1 through 6 {
          &.level#{$i} {
            padding-left: ($i - 1) * 14px + 12px;
          }
        }
      }
    }`,
    imports: [],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlogPostTocComponent implements OnDestroy {
  private transferState = inject(TransferState);
  private platformService = inject(PlatformService);
  private contentObserver = inject(ContentObserver);

  private _contentElement!: HTMLElement;
  private _contentElement$ = new ReplaySubject<HTMLElement>(1);

  @Input()
  set contentElement(value: HTMLElement) {
    this._contentElement = value;
    this._contentElement$.next(this._contentElement);
  }

  private headings$ = this._contentElement$.pipe(
    switchMap((contentElement) =>
      this.contentObserver.observe(contentElement).pipe(
        map(() => contentElement),
        startWith(contentElement)
      )
    ),
    map((element) => ({ cacheHeadings: this.getCacheHeadings(), element })),
    map((data) => {
      if (data.cacheHeadings && data.cacheHeadings.length > 0) {
        if (!this.platformService.isServer) {
          this.removeCacheHeadings();
        }
        return { headings: data.cacheHeadings, element: data.element };
      } else {
        const tocHeadings = this.getTocHeadings(data.element);
        if (this.platformService.isServer) {
          this.setCacheHeadings(tocHeadings);
        }
        return { headings: tocHeadings, element: data.element };
      }
    }),
    map((data) => {
      // client 端重新抓一次 toc
      if (!this.platformService.isServer) {
        return {
          headings: this.getTocHeadings(data.element),
          element: data.element,
        };
      }
      return data;
    }),
    switchMap((data) =>
      this.getContentTocHeadings(data.headings, data.element)
    ),
    startWith(this.getCacheHeadings())
  );

  protected headings = toSignal(this.headings$, { initialValue: [] });

  private _intersectionObserver?: IntersectionObserver | null;

  getCacheHeadings() {
    return this.transferState.get<Heading[]>(HEADINGS_CACHE_KEY, []);
  }

  setCacheHeadings(headings: Heading[]) {
    this.transferState.set<Heading[]>(HEADINGS_CACHE_KEY, headings);
  }

  removeCacheHeadings() {
    this.transferState.remove(HEADINGS_CACHE_KEY);
  }

  getContentTocHeadings(headings: Heading[], element: HTMLElement) {
    return new Observable<Heading[]>((subscriber) => {
      // 先回傳目前內容
      subscriber.next(headings);

      if (this.platformService.isServer) {
        subscriber.complete();
        return;
      }

      // client 計算要 active 的 element

      const containerElement = element.closest(
        '.mat-drawer-content.main-content'
      );
      const options = {
        root: containerElement,
        rootMargin: '0px',
        threshold: 1.0,
      };

      let visibleElements: HTMLElement[] = [];
      if (this._intersectionObserver) {
        this._intersectionObserver.disconnect();
        this._intersectionObserver = null;
      }

      this._intersectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visibleElements = [...visibleElements, entry.target as HTMLElement];
          } else {
            visibleElements = visibleElements.filter(
              (element) => element !== entry.target
            );
          }
        });

        if (visibleElements.length > 0) {
          const visibleElement = visibleElements.sort(
            (a, b) => a.offsetTop - b.offsetTop
          )[0];
          subscriber.next(
            headings.map((head) => ({
              ...head,
              active: head.element === visibleElement,
            }))
          );
        }
      }, options);

      headings.forEach((head) => {
        this._intersectionObserver!.observe(head.element!);
      });
    });
  }

  private getTocHeadings(element: HTMLElement) {
    const result: Array<Heading> = [];
    element.querySelectorAll('h1,h2,h3,h4,h5,h6').forEach((head) => {
      result.push({
        text: head.textContent || '',
        level: +head.tagName.replace(/h(.)/i, '$1'),
        element: this.platformService.isServer ? undefined : head as HTMLElement,
        active: false,
      });
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
