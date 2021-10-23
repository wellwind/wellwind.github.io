import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { isPlatformServer } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { combineLatest } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { MarkdownMeta } from 'site-utils';
import { findMainContentContainer, scrollTo } from '../../../utils';
import { SiteMetaService } from '../../site-meta.service';
import { SitePostService } from '../../site-post.service';

@Component({
  selector: 'app-blog-post',
  templateUrl: './blog-post.component.html',
  styleUrls: ['./blog-post.component.scss']
})
export class BlogPostComponent implements OnInit, AfterViewInit {

  @ViewChild('comments') comments?: ElementRef<HTMLElement>;

  postMeta$ = this.route.data.pipe(
    map(data => data.content as MarkdownMeta)
  );

  postContent$ = this.postMeta$.pipe(
    map(postMeta => this.domSanitizer.bypassSecurityTrustHtml(postMeta.summary + postMeta.content)),
    tap(() => this.highlightCode())
  );

  hideToc$ =
    this.breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium
    ]).pipe(map(value => value.matches));

  previousPost$ = combineLatest([this.postMeta$, this.sitePostService.postsMetaWithSlugAndSortAsc$]).pipe(
    map(([currentPostMeta, allPostsMeta]) => {
      const found = allPostsMeta.filter(post => new Date(post.date) < new Date(currentPostMeta.date));
      if (found) {
        return found[found.length - 1];
      }
      return null;
    })
  )

  nextPost$ = combineLatest([this.postMeta$, this.sitePostService.postsMetaWithSlugAndSortAsc$]).pipe(
    map(([currentPostMeta, allPostsMeta]) => {
      const found = allPostsMeta.filter(post => new Date(post.date) > new Date(currentPostMeta.date));
      if (found) {
        return found[0];
      }
      return null;
    })
  )

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private route: ActivatedRoute,
    private domSanitizer: DomSanitizer,
    private breakpointObserver: BreakpointObserver,
    private sitePostService: SitePostService,
    private siteMetaService: SiteMetaService) {
  }

  ngOnInit(): void {
    this.postMeta$.subscribe(postMeta => {
      this.siteMetaService.resetMeta({
        title: postMeta.title,
        type: 'article',
        description: postMeta.summary
          .replace(/<[^>]*>/gm, '')
          .replace(/\n/g, '')
          .trim(),
        keywords: postMeta.tags || []
      });
    });
  }

  ngAfterViewInit() {
    if (isPlatformServer(this.platformId)) {
      return;
    }

    this.highlightCode();

    if (this.comments && this.comments.nativeElement) {
      const element = this.comments.nativeElement;
      const scriptTag = document.createElement('script');

      scriptTag.setAttribute('src', 'https://utteranc.es/client.js');
      scriptTag.setAttribute('repo', 'wellwind/wellwind.github.io');
      scriptTag.setAttribute('issue-term', 'title');
      scriptTag.setAttribute('label', 'comment');
      scriptTag.setAttribute('theme', 'github-light');
      scriptTag.setAttribute('crossorigin', 'anonymous');
      scriptTag.setAttribute('async', '');

      element.appendChild(scriptTag);
    }
  }

  highlightCode() {
    setTimeout(() => {
      (window as any)?.hljs?.highlightAll();
    });
  }

  goTop(contentElement: HTMLElement) {
    if (contentElement) {
      const containerElement = findMainContentContainer(contentElement);
      if (containerElement) {
        scrollTo(0, containerElement);
      }
    }
  }

  goComment(commentsElement: HTMLElement) {
    if (commentsElement) {
      const containerElement = findMainContentContainer(commentsElement);
      if (containerElement) {
        scrollTo(commentsElement.offsetTop + 256, containerElement);
      }
    }
  }
}
