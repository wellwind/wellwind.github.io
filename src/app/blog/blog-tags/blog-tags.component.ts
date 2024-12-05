import { KeyValuePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { getRouteData } from 'src/app/site-common/route-utils';
import { PostMetaWithSlug } from '../../site-common/post-meta.interface';
import { SiteMetaService } from '../../site-common/site-meta.service';
import { SlugifyPipe } from '../../site-common/slugify.pipe';
import { BlogPostTagSizePipe } from './blog-post-tag-size.pipe';

@Component({
    selector: 'app-blog-tags',
    template: `
    <mat-card appearance="outlined" class="blog-post">
      <mat-card-title class="blog-post-title">標籤</mat-card-title>

      <mat-card-subtitle class="blog-post-subtitle">
        共 {{ ($any(tags()) | keyvalue).length }} 個標籤
      </mat-card-subtitle>

      <mat-card-content class="blog-post-content">
        <div class="tags">
          @for (tag of $any(tags()) | keyvalue; track tag) { @if (tag?.key) {
          <a
            class="tag size-{{
              $any(tag.value).length | blogPostTagSize : maxPostsCount() || 0
            }}"
            [routerLink]="['/blog/tags', $any(tag.key) | slugify]"
          >
            {{ tag.key }}
          </a>
          } }
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
    }`,
    imports: [
        MatCardModule,
        RouterLink,
        KeyValuePipe,
        SlugifyPipe,
        BlogPostTagSizePipe,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlogTagsComponent {
  private siteMetaService = inject(SiteMetaService);

  protected tags = getRouteData(
    (data) => data.tags as { [key: string]: Array<PostMetaWithSlug> },
    {}
  );
  protected aa = computed(() =>
    Object.values(this.tags()).map((item) => item.length)
  );
  protected maxPostsCount = computed(() =>
    Math.max(...Object.values(this.tags()).map((post) => post.length))
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
