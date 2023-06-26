import { KeyValuePipe, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RxPush } from '@rx-angular/template/push';
import { map } from 'rxjs/operators';
import { PostMetaWithSlug } from '../../post-meta.interface';
import { SlugifyPipe } from '../../site-common/slugify/slugify.pipe';
import { SiteMetaService } from '../../site-meta.service';

@Component({
    selector: 'app-blog-categories',
    templateUrl: './blog-categories.component.html',
    styleUrls: ['./blog-categories.component.scss'],
    standalone: true,
    imports: [MatCardModule, NgFor, RouterLink, KeyValuePipe, SlugifyPipe, RxPush]
})
export class BlogCategoriesComponent implements OnInit {

  categories$ = this.route.data.pipe(
    map(data => data.categories as { [key: string]: PostMetaWithSlug[] })
  );

  constructor(private route: ActivatedRoute, private siteMetaService: SiteMetaService) {
  }

  ngOnInit(): void {
    this.siteMetaService.resetMeta({
      title: '分類',
      description: '顯示所有分類',
      keywords: [''],
      type: 'website'
    });
  }

}
