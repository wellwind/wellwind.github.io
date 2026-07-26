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

@Component({
  selector: 'app-blog-categories',
  template: `
    <mat-card appearance="outlined" class="blog-post">
      <mat-card-title class="blog-post-title"> 分類 </mat-card-title>

      <mat-card-subtitle class="blog-post-subtitle">
        共 {{ categoryEntries().length }} 個分類
      </mat-card-subtitle>

      <mat-card-content class="blog-post-content">
        <ul>
          @for (category of categoryEntries(); track category.name) {
            <li>
              <a [routerLink]="['/blog/categories', category.name | slugify]">
                {{ category.name }}
              </a>
              ({{ category.posts.length }})
            </li>
          }
        </ul>
      </mat-card-content>
    </mat-card>
  `,
  styles: ``,
  imports: [MatCardModule, RouterLink, SlugifyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogCategoriesComponent {
  private readonly siteMetaService = inject(SiteMetaService);
  protected categories = getRouteData(
    (data) => data.categories as Record<string, PostMetaWithSlug[]>,
    {},
  );
  protected readonly categoryEntries = computed(() =>
    Object.entries(this.categories()).map(([name, posts]) => ({ name, posts })),
  );

  private _updateMetaEffect = effect(() => {
    this.siteMetaService.resetMeta({
      title: '分類',
      description: '顯示所有分類',
      keywords: [''],
      type: 'website',
    });
  });
}
