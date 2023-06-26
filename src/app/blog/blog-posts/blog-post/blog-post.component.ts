import { PostMetaWithSlug } from './../../../post-meta.interface';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { combineLatest } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { MarkdownMeta } from 'site-utils';
import { PlatformService } from '../../../../platform.service';
import { findMainContentContainer, scrollTo } from '../../../../utils';
import { SiteMetaService } from '../../../site-meta.service';
import { SitePostService } from '../../../site-post.service';
import { RxPush } from '@rx-angular/template/push';
import { SlugifyPipe } from '../../../site-common/slugify/slugify.pipe';
import { PostDateAsPathPipe } from '../../../site-common/post-date-as-path/post-date-as-path.pipe';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { BlogPostTocComponent } from './blog-post-toc/blog-post-toc.component';
import { CommentComponent } from '../../../site-common/comment/comment.component';
import { MatIconModule } from '@angular/material/icon';
import { LikerCoinComponent } from '../../../site-common/liker-coin/liker-coin.component';
import { MatRippleModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { BlogPostSubtitleComponent } from '../../../site-common/blog-post-subtitle/blog-post-subtitle.component';
import { NgIf, NgFor, NgTemplateOutlet } from '@angular/common';

const findPreviousPost = (
  posts: PostMetaWithSlug[],
  target: MarkdownMeta
) => {
  const found = posts.filter(
    (post) => new Date(post.date) < new Date(target.date)
  );
  if (found) {
    return found[found.length - 1];
  }
  return null;
};

const findNextPost = (posts: PostMetaWithSlug[], target: MarkdownMeta) => {
  const found = posts.filter(
    (post) => new Date(post.date) > new Date(target.date)
  );
  if (found) {
    return found[0];
  }
  return null;
};
@Component({
    selector: 'app-blog-post',
    templateUrl: './blog-post.component.html',
    styleUrls: ['./blog-post.component.scss'],
    standalone: true,
    imports: [NgIf, BlogPostSubtitleComponent, MatDividerModule, NgFor, MatRippleModule, RouterLink, LikerCoinComponent, MatIconModule, NgTemplateOutlet, CommentComponent, BlogPostTocComponent, MatButtonModule, MatTooltipModule, PostDateAsPathPipe, SlugifyPipe, RxPush]
})
export class BlogPostComponent implements OnInit, AfterViewInit {
  @ViewChild('comments') comments?: ElementRef<HTMLElement>;

  get isServer() {
    return this.platformService.isServer;
  }

  postMeta$ = this.route.data.pipe(map((data) => data.content as MarkdownMeta));

  postContent$ = this.postMeta$.pipe(
    map((postMeta) =>
      this.domSanitizer.bypassSecurityTrustHtml(
        postMeta.summary + postMeta.content
      )
    ),
    tap(() => this.highlightCode())
  );

  postCategoriesPrevNext$ = combineLatest([
    this.postMeta$,
    this.sitePostService.categoriesAndPosts$,
  ]).pipe(
    map(([postMeta, categoriesPosts]) =>
      (postMeta.categories || [])
        .filter((category) => !!categoriesPosts[category])
        .map((category) => ({
          category,
          previousPost: findPreviousPost(categoriesPosts[category], postMeta),
          nextPost: findNextPost(categoriesPosts[category], postMeta),
        }))
    )
  );

  previousPost$ = combineLatest([
    this.postMeta$,
    this.sitePostService.postsMetaWithSlugAndSortAsc$,
  ]).pipe(
    map(([currentPostMeta, allPostsMeta]) => findPreviousPost(allPostsMeta, currentPostMeta))
  );

  nextPost$ = combineLatest([
    this.postMeta$,
    this.sitePostService.postsMetaWithSlugAndSortAsc$,
  ]).pipe(
    map(([currentPostMeta, allPostsMeta]) => {
      const found = allPostsMeta.filter(
        (post) => new Date(post.date) > new Date(currentPostMeta.date)
      );
      if (found) {
        return found[0];
      }
      return null;
    })
  );

  constructor(
    private route: ActivatedRoute,
    private domSanitizer: DomSanitizer,
    private platformService: PlatformService,
    private sitePostService: SitePostService,
    private siteMetaService: SiteMetaService
  ) {}

  ngOnInit(): void {
    this.postMeta$.subscribe((postMeta) => {
      this.siteMetaService.resetMeta({
        title: postMeta.title,
        type: 'article',
        description: postMeta.summary
          .replace(/<[^>]*>/gm, '')
          .replace(/\n/g, '')
          .trim(),
        keywords: postMeta.tags || [],
        ogImage: postMeta.ogImage,
      });
    });
  }

  ngAfterViewInit() {
    if (this.platformService.isServer) {
      return;
    }
  }

  highlightCode() {
    if (this.platformService.isServer) {
      return;
    }

    setTimeout(() => {
      (window as any)?.hljs?.highlightAll();
    });
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
