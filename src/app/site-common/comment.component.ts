import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { PlatformService } from './platform.service';

@Component({
  selector: 'app-comment',
  template: ``,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentComponent implements OnInit, AfterViewInit, OnDestroy {
  private router = inject(Router);
  private elementRef = inject(ElementRef<HTMLElement>);
  private platformService = inject(PlatformService);

  private subscription = new Subscription();

  ngOnInit() {
    this.subscription.add(
      this.router.events
        .pipe(filter((event) => event instanceof NavigationStart))
        .subscribe(() => {
          this.elementRef.nativeElement.innerHTML = '';
        })
    );

    this.subscription.add(
      this.router.events
        .pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe(() => {
          this.generateComment();
        })
    );
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
      localStorage.getItem('theme') === 'dark' ? 'dark_dimmed' : 'light'
    );
    scriptTag.setAttribute('data-lang', 'zh-TW');
    scriptTag.setAttribute('data-loading', 'lazy');
    scriptTag.setAttribute('crossorigin', 'anonymous');
    scriptTag.setAttribute('async', '');

    element.appendChild(scriptTag);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
