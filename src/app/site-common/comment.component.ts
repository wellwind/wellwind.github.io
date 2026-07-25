import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  OnInit,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs';
import { PlatformService } from '@shared/infrastructure';

@Component({
  selector: 'app-comment',
  template: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentComponent implements OnInit, AfterViewInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly platformService = inject(PlatformService);

  ngOnInit() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationStart),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.elementRef.nativeElement.innerHTML = '';
      });

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.generateComment();
      });
  }

  ngAfterViewInit() {
    this.generateComment();
  }

  generateComment() {
    if (this.platformService.isServer) {
      return;
    }

    const element = this.elementRef.nativeElement;

    const scriptTag = document.createElement('script');
    scriptTag.setAttribute('src', 'https://giscus.app/client.js');
    scriptTag.setAttribute('data-repo', 'wellwind/wellwind.github.io');
    scriptTag.setAttribute('data-repo-id', 'MDEwOlJlcG9zaXRvcnkzNjUwOTQ1OQ==');
    scriptTag.setAttribute('data-category', 'Announcements');
    scriptTag.setAttribute('data-category-id', 'DIC_kwDOAi0XE84B_q6C');
    scriptTag.setAttribute('data-mapping', 'title');
    scriptTag.setAttribute('data-reactions-enabled', '1');
    scriptTag.setAttribute('data-emit-metadata', '0');
    scriptTag.setAttribute(
      'data-theme',
      localStorage.getItem('theme') === 'dark' ? 'dark_dimmed' : 'light',
    );
    scriptTag.setAttribute('data-lang', 'zh-TW');
    scriptTag.setAttribute('data-loading', 'lazy');
    scriptTag.setAttribute('crossorigin', 'anonymous');
    scriptTag.setAttribute('async', '');

    element.appendChild(scriptTag);
  }
}
