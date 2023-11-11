import { KeyValuePipe } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { getRouteData } from 'src/app/site-common/route-utils';
import { PostMetaWithSlug } from '../../site-common/post-meta.interface';
import { SiteMetaService } from '../../site-common/site-meta.service';
import { SlugifyPipe } from '../../site-common/slugify.pipe';

@Component({
  selector: 'app-blog-categories',
  template: `
    <mat-card appearance="outlined" class="blog-post">
      <mat-card-title class="blog-post-title"> 分類 </mat-card-title>

      <mat-card-subtitle class="blog-post-subtitle">
        共 {{ ($any(categories()) | keyvalue).length }} 個分類
      </mat-card-subtitle>

      <mat-card-content class="blog-post-content">
        <ul>
          @for (category of $any(categories()) | keyvalue; track category.key) {
          <li>
            <a
              [routerLink]="[
                '/blog/categories',
                $any(category.key || '') | slugify
              ]"
            >
              {{ category.key }}
            </a>
            ({{ $any(category.value).length }})
          </li>
          }
        </ul>
      </mat-card-content>
    </mat-card>
  `,
  styles: ``,
  standalone: true,
  imports: [MatCardModule, RouterLink, KeyValuePipe, SlugifyPipe],
})
export class BlogCategoriesComponent {
  private siteMetaService = inject(SiteMetaService);
  protected categories = getRouteData(
    (data) => data.categories as { [key: string]: Array<PostMetaWithSlug> },
    {}
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
