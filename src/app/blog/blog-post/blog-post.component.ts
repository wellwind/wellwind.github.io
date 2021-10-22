import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { MarkdownMeta } from 'site-utils';
import { SiteMetaService } from '../../site-meta.service';

@Component({
  selector: 'app-blog-post',
  templateUrl: './blog-post.component.html',
  styleUrls: ['./blog-post.component.scss']
})
export class BlogPostComponent implements OnInit, AfterViewInit {

  postMeta$ = this.route.data.pipe(
    map(data => data.content as MarkdownMeta)
  );

  postContent$ = this.postMeta$.pipe(
    map(postMeta => this.domSanitizer.bypassSecurityTrustHtml(postMeta.summary + postMeta.content))
  );

  hideToc$ =
    this.breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium
    ]).pipe(map(value => value.matches));

  constructor(
    private route: ActivatedRoute,
    private domSanitizer: DomSanitizer,
    private breakpointObserver: BreakpointObserver,
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
    (window as any)?.hljs?.highlightAll();
  }
}
