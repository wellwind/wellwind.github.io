import { Component, ElementRef, OnDestroy } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { PlatformService } from '../../../platform.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnDestroy {

  subscription = new Subscription();

  constructor(
    private router: Router,
    private elementRef: ElementRef<HTMLElement>,
    private platformService: PlatformService) {

    if (this.platformService.isServer) {
      return;
    }
    this.subscription.add(
      this.router.events.pipe(
        filter(event => event instanceof NavigationStart)
      ).subscribe(() => {
        this.elementRef.nativeElement.innerHTML = '';
      })
    );

    this.subscription.add(
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe(() => {
        this.generateComment();
      })
    );

  }

  ngAfterViewInit() {
    this.generateComment();

  }

  generateComment() {
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
    scriptTag.setAttribute('data-theme', 'light');
    scriptTag.setAttribute('data-lang', 'en');
    scriptTag.setAttribute('crossorigin', 'anonymous');
    scriptTag.setAttribute('async', '');

    element.appendChild(scriptTag);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
