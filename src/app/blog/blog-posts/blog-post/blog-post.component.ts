import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  ElementRef,
  computed,
  effect,
  inject,
  viewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { MarkdownMeta } from 'site-utils';
import { getRouteData } from 'src/app/site-common/route-utils';
import { findMainContentContainer, scrollTo } from '../../../../utils';
import { BlogPostSubtitleComponent } from '../../../site-common/blog-post-subtitle.component';
import { CommentComponent } from '../../../site-common/comment.component';
import { LikerCoinComponent } from '../../../site-common/liker-coin.component';
import { PlatformService } from '../../../site-common/platform.service';
import { PostDateAsPathPipe } from '../../../site-common/post-date-as-path.pipe';
import { PostMetaWithSlug } from '../../../site-common/post-meta.interface';
import { SiteMetaService } from '../../../site-common/site-meta.service';
import { SitePostService } from '../../../site-common/site-post.service';
import { SlugifyPipe } from '../../../site-common/slugify.pipe';
import { BlogPostTocComponent } from './blog-post-toc.component';

const findPreviousPost = (posts: PostMetaWithSlug[], target: MarkdownMeta) => {
  const found = posts.filter(
    (post) => new Date(post.date) < new Date(target.date),
  );
  if (found) {
    return found[found.length - 1];
  }
  return null;
};

const findNextPost = (posts: PostMetaWithSlug[], target: MarkdownMeta) => {
  const found = posts.filter(
    (post) => new Date(post.date) > new Date(target.date),
  );
  if (found) {
    return found[0];
  }
  return null;
};
@Component({
  selector: 'app-blog-post',
  template: `@if (postMeta(); as postMeta) {
    <div class="blog-post-container flex items-start">
      <article class="blog-post blog-post-overview w-full !p-0 xl:w-[80%]">
        <header>
          <div class="blog-post-title">
            <h1 class="m-0 text-2xl md:text-3xl">{{ postMeta.title }}</h1>
          </div>

          <div class="blog-post-subtitle">
            <app-blog-post-subtitle
              [postMeta]="postMeta"
            ></app-blog-post-subtitle>
          </div>
        </header>
        <mat-divider class="!my-2"></mat-divider>

        <section
          class="blog-post !p-0"
          #content
          [innerHTML]="postContent()"
        ></section>

        <!-- blog post tags -->
        <div aria-label="Post Tags" class="flex justify-center">
          @for (tag of postMeta.tags; track tag) {
            <a
              [routerLink]="['/blog/tags', tag | slugify]"
              matRipple
              class="text-white text-sm bg-blue-800 hover:bg-blue-600 rounded-3xl px-3 py-2 m-1 no-underline hover:no-underline hover:text-white"
            >
              {{ tag }}
            </a>
          }
        </div>

        <div class="blog-post-liker-coin mt-4">
          <div>
            如果您覺得我的文章有幫助，歡迎免費成為 LikeCoin 會員，幫我的文章拍手
            5 次表示支持！
          </div>
          <app-liker-coin likerId="wellwind"></app-liker-coin>
        </div>

        <mat-divider class="!my-2"></mat-divider>

        <footer>
          <!-- prev & next by categories -->
          @for (
            categoryPrevNext of postCategoriesPrevNext();
            track categoryPrevNext.category
          ) {
            @if (categoryPrevNext.previousPost || categoryPrevNext.nextPost) {
              <div class="flex items-center">
                <mat-icon class="pr-1">folder_open</mat-icon>
                <a
                  class="blog-post-category-link"
                  [routerLink]="[
                    '/blog/categories',
                    categoryPrevNext.category | slugify,
                  ]"
                  >{{ categoryPrevNext.category }}</a
                >
              </div>

              <div class="blog-post-prev-next flex items-start">
                <div
                  class="blog-post-prev flex flex-col flex-[50%] items-start justify-start text-start"
                >
                  @if (categoryPrevNext.previousPost; as post) {
                    <div
                      class="blog-post-prev-next-notify prev flex items-center text-sm w-full justify-start text-[color:var(--post-next-prev-text-color)]"
                    >
                      <mat-icon>chevron_left</mat-icon>
                      上一篇
                    </div>
                    <ng-container
                      *ngTemplateOutlet="postLink; context: { post: post }"
                    ></ng-container>
                  }
                </div>
                <div
                  class="blog-post-next flex flex-col flex-[50%] items-start justify-end text-end"
                >
                  @if (categoryPrevNext.nextPost; as post) {
                    <div
                      class="blog-post-prev-next-notify next flex items-center text-sm w-full justify-end text-[color:var(--post-next-prev-text-color)]"
                    >
                      下一篇
                      <mat-icon>chevron_right</mat-icon>
                    </div>
                    <ng-container
                      *ngTemplateOutlet="postLink; context: { post: post }"
                    ></ng-container>
                  }
                </div>
              </div>
              <mat-divider class="!my-2"></mat-divider>
            }
          }

          <!-- prev & next by date -->
          <div class="flex items-center">
            <mat-icon class="pr-1">calendar_month</mat-icon>
            <span>按照日期</span>
          </div>

          <div class="blog-post-prev-next flex items-start">
            <div
              class="blog-post-prev flex flex-col flex-[50%] items-start justify-start text-start"
            >
              @if (previousPost(); as post) {
                <div
                  class="blog-post-prev-next-notify prev flex items-center text-sm w-full justify-start text-[color:var(--post-next-prev-text-color)]"
                >
                  <mat-icon>chevron_left</mat-icon>
                  上一篇
                </div>
                <ng-container
                  *ngTemplateOutlet="postLink; context: { post: post }"
                ></ng-container>
              }
            </div>
            <div
              class="blog-post-next flex flex-col flex-[50%] items-start justify-end text-end"
            >
              @if (nextPost(); as post) {
                <div
                  class="blog-post-prev-next-notify next flex items-center text-sm w-full justify-end text-[color:var(--post-next-prev-text-color)]"
                >
                  下一篇
                  <mat-icon>chevron_right</mat-icon>
                </div>
                <ng-container
                  *ngTemplateOutlet="postLink; context: { post: post }"
                ></ng-container>
              }
            </div>
          </div>

          <ng-template #postLink let-post="post">
            <a class="w-full" [routerLink]="post | postDateAsPath">
              {{ post.title }}
            </a>
          </ng-template>

          <mat-divider class="!my-2"></mat-divider>

          <!-- comments -->
          <h3>有任何問題或建議嗎？歡迎留言給我</h3>
          <div class="blog-post-comments" #comments>
            <app-comment class="blog-post-comments"></app-comment>
          </div>
        </footer>
      </article>

      <div class="blog-post-toc hidden xl:block xl:w-[19%]">
        <app-blog-post-toc [contentElement]="content"></app-blog-post-toc>
      </div>

      <button
        role="button"
        aria-label="留個言吧"
        mat-fab
        color="default"
        class="go-comment !fixed bottom-8 right-24 !bg-[color:var(--background-color)]"
        (click)="goComment(comments)"
        matTooltip="留言"
      >
        <mat-icon>comment</mat-icon>
      </button>
    </div>
  } `,
  styles: ``,
  imports: [
    BlogPostSubtitleComponent,
    MatDividerModule,
    MatRippleModule,
    RouterLink,
    LikerCoinComponent,
    MatIconModule,
    NgTemplateOutlet,
    CommentComponent,
    BlogPostTocComponent,
    MatButtonModule,
    MatTooltipModule,
    PostDateAsPathPipe,
    SlugifyPipe,
  ],
})
export class BlogPostComponent {
  private domSanitizer = inject(DomSanitizer);
  private platformService = inject(PlatformService);
  private sitePostService = inject(SitePostService);
  private siteMetaService = inject(SiteMetaService);

  readonly comments = viewChild<ElementRef<HTMLElement>>('comments');

  protected get isServer() {
    return this.platformService.isServer;
  }

  protected postMeta = getRouteData((data) => data.content as MarkdownMeta, {
    slug: '',
    title: '',
    date: '',
    categories: [],
    tags: [],
    summary: '',
    content: '',
    originalContent: '',
  });

  protected postContent = computed(() => {
    return this.domSanitizer.bypassSecurityTrustHtml(
      this.postMeta().summary + this.postMeta().content,
    );
  });

  protected postCategoriesPrevNext = computed(() => {
    const postMeta = this.postMeta();
    const categoriesPosts = this.sitePostService.categoriesAndPosts();
    return (postMeta?.categories || [])
      .filter((category) => !!categoriesPosts[category])
      .map((category) => ({
        category,
        previousPost: findPreviousPost(categoriesPosts[category], postMeta),
        nextPost: findNextPost(categoriesPosts[category], postMeta),
      }));
  });

  protected previousPost = computed(() => {
    const postMeta = this.postMeta();
    const posts = this.sitePostService.postsMetaWithSlugAndSortAsc();
    return findPreviousPost(posts, postMeta);
  });

  protected nextPost = computed(() => {
    const postMeta = this.postMeta();
    const posts = this.sitePostService.postsMetaWithSlugAndSortAsc();
    const found = posts.filter(
      (post) => new Date(post.date) > new Date(postMeta.date),
    );
    if (found) {
      return found[0];
    }
    return null;
  });

  private _updateMetaEffect = effect(() => {
    this.siteMetaService.resetMeta({
      title: this.postMeta().title,
      type: 'article',
      description: this.postMeta()
        .summary.replace(/<[^>]*>/gm, '')
        .replace(/\n/g, '')
        .trim(),
      keywords: this.postMeta().tags || [],
      ogImage: this.postMeta().ogImage,
    });
  });

  goComment(commentsElement: HTMLElement) {
    if (commentsElement) {
      const containerElement = findMainContentContainer(commentsElement);
      if (containerElement) {
        scrollTo(commentsElement.offsetTop + 256, containerElement);
      }
    }
  }
}
