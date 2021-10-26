import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { PostMetaWithSlug } from '../../post-meta.interface';

@Component({
  selector: 'app-blog-categories',
  templateUrl: './blog-categories.component.html',
  styleUrls: ['./blog-categories.component.scss']
})
export class BlogCategoriesComponent implements OnInit {

  categories$ = this.route.data.pipe(
    map(data => data.categories as { [key: string]: PostMetaWithSlug[] })
  );

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit(): void {
  }

}
