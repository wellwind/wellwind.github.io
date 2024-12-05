import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SitePostService } from '../site-common/site-post.service';

@Component({
    selector: 'app-layout-sidebar',
    imports: [
        RouterLink,
        RouterLinkActive,
        MatDividerModule,
        MatListModule,
        MatIconModule,
    ],
    template: `
    <div class="post-statics flex p-4">
      <div class="statics-block flex flex-col flex-[33%]">
        <a routerLink="/blog/archives" class="no-underline hover:no-underline">
          <div
            class="counter text-[color:var(--sidebar-highlight-text-color)] text-[24px] text-center"
          >
            {{ postCount() }}
          </div>
          <div
            class="description text-[color:var(--sidebar-text-color)] text-[16px] text-center"
          >
            文章
          </div>
        </a>
      </div>
      <div class="statics-block flex flex-col flex-[33%]">
        <a
          routerLink="/blog/categories"
          class="no-underline hover:no-underline"
        >
          <div
            class="counter text-[color:var(--sidebar-highlight-text-color)] text-[24px] text-center"
          >
            {{ categoryCount() }}
          </div>
          <div
            class="description text-[color:var(--sidebar-text-color)] text-[16px] text-center"
          >
            分類
          </div>
        </a>
      </div>
      <div class="statics-block flex flex-col flex-[33%]">
        <a routerLink="/blog/tags" class="no-underline hover:no-underline">
          <div
            class="counter text-[color:var(--sidebar-highlight-text-color)] text-[24px] text-center"
          >
            {{ tagCount() }}
          </div>
          <div
            class="description text-[color:var(--sidebar-text-color)] text-[16px] text-center"
          >
            標籤
          </div>
        </a>
      </div>
    </div>

    <mat-divider class="my-1"></mat-divider>

    <div>
      <div
        class="section-title text-[color:var(--sidebar-text-color)] text-[20px] text-center my-1"
      >
        好書推薦
      </div>
      <div
        class="section-content text-[color:var(--sidebar-text-color)] text-center"
      >
        <mat-nav-list>
          <a
            href="https://www.tenlong.com.tw/products/9789864348039"
            class="no-underline"
            target="_blank"
            rel="noreferrer"
            style="display: flex; flex-direction: column; align-items: center"
          >
            <img
              src="assets/promotion/rxjs.webp"
              width="160px"
              height="224px"
              alt="打通 RxJS 任督二脈 - 好評熱售中！"
              loading="lazy"
            />
            <div>打通 RxJS 任督二脈</div>
          </a>
        </mat-nav-list>
      </div>
    </div>

    <mat-divider class="my-1"></mat-divider>

    <mat-nav-list>
      @for (item of menuItems(); track item.link) {
      <a
        mat-list-item
        routerLinkActive="text-[color:var(--sidebar-highlight-text-color)] bg-[color:var(--sidebar-highlight-bg-color)]"
        [routerLinkActiveOptions]="{ exact: item.link === '/blog' }"
        [routerLink]="item.link"
      >
        <span class="flex flex-row">
          <mat-icon class="mr-2">{{ item.icon }}</mat-icon>
          <span class="link-text">{{ item.text }}</span>
        </span>
      </a>
      }
    </mat-nav-list>

    <mat-divider class="my-1"></mat-divider>

    <mat-nav-list>
      <a mat-list-item href="/atom.xml" target="_blank" rel="noreferrer">
        <span class="flex flex-row">
          <mat-icon class="mr-2">rss_feed</mat-icon>
          <span class="link-text">RSS</span>
        </span>
      </a>
      <a
        mat-list-item
        href="https://github.com/wellwind/"
        target="_blank"
        rel="noreferrer"
      >
        <span class="flex flex-row">
          <mat-icon
            class="mr-2"
            fontSet="fontawesome"
            fontIcon="fa-github"
          ></mat-icon>
          <span class="link-text">GitHub</span>
        </span>
      </a>
      <a
        mat-list-item
        href="https://www.facebook.com/fullstackledder"
        target="_blank"
        rel="noreferrer"
      >
        <span class="flex flex-row">
          <mat-icon
            class="mr-2"
            fontSet="fontawesome"
            fontIcon="fa-facebook"
          ></mat-icon>
          <span class="link-text">Facebook</span>
        </span>
      </a>
    </mat-nav-list>
  `,
    styles: ``,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutSidebarComponent implements OnInit {
  private matIconRegistry = inject(MatIconRegistry);
  private sitePostService = inject(SitePostService);

  protected postCount = computed(
    () => Object.keys(this.sitePostService.postsMeta() as object).length
  );
  protected categoryCount = computed(
    () => new Set(this.sitePostService.postCategories()).size
  );
  protected tagCount = computed(
    () => new Set(this.sitePostService.postTags()).size
  );

  protected menuItems = signal([
    { link: '/blog', icon: 'home', text: '首頁' },
    { link: '/blog/categories', icon: 'apps', text: '分類' },
    { link: '/blog/tags', icon: 'label', text: '標籤' },
    { link: '/blog/archives', icon: 'archive', text: '歸檔' },
  ]).asReadonly();

  ngOnInit(): void {
    this.matIconRegistry.registerFontClassAlias('fontawesome', 'fab');
  }
}
