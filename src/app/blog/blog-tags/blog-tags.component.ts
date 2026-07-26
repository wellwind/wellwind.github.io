import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { PostMetaWithSlug } from '@shared/core';
import { getRouteData } from '../../site-common/route-utils';
import { SiteMetaService } from '../../site-common/site-meta.service';
import { SlugifyPipe } from '../../site-common/slugify.pipe';
import { BlogPostTagSizePipe } from './blog-post-tag-size.pipe';

@Component({
  selector: 'app-blog-tags',
  template: `
    <mat-card appearance="outlined" class="blog-post">
      <mat-card-title class="blog-post-title">標籤</mat-card-title>

      <mat-card-subtitle class="blog-post-subtitle">
        共 {{ tagEntries().length }} 個標籤
      </mat-card-subtitle>

      <mat-card-content class="blog-post-content">
        <div class="tags">
          @for (tag of tagEntries(); track tag.name) {
            @if (tag.name) {
              <a
                class="tag size-{{
                  tag.posts.length | blogPostTagSize: maxPostsCount()
                }}"
                [routerLink]="['/blog/tags', tag.name | slugify]"
              >
                {{ tag.name }}
              </a>
            }
          }
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: `
    .tags {
      text-align: center;
      line-height: 36px;
      margin: 8px;

      .tag {
        margin: 8px;

        &.size-1 {
          font-size: 36px;
        }
        &.size-2 {
          font-size: 30px;
        }
        &.size-3 {
          font-size: 24px;
        }
        &.size-4 {
          font-size: 16px;
        }
      }
    }
  `,
  imports: [MatCardModule, RouterLink, SlugifyPipe, BlogPostTagSizePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogTagsComponent {
  private readonly siteMetaService = inject(SiteMetaService);

  protected tags = getRouteData(
    (data) => data.tags as Record<string, PostMetaWithSlug[]>,
    {},
  );
  protected readonly tagEntries = computed(() =>
    Object.entries(this.tags()).map(([name, posts]) => ({ name, posts })),
  );
  protected readonly maxPostsCount = computed(() =>
    Math.max(0, ...this.tagEntries().map((tag) => tag.posts.length)),
  );

  private _updateMetaEffect = effect(() => {
    this.siteMetaService.resetMeta({
      title: '標籤',
      description: '顯示所有標籤',
      keywords: [''],
      type: 'website',
    });
  });
}
