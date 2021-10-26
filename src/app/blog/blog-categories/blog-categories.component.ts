import { Component, OnInit } from '@angular/core';
import { SitePostService } from '../../site-post.service';

@Component({
  selector: 'app-blog-categories',
  templateUrl: './blog-categories.component.html',
  styleUrls: ['./blog-categories.component.scss']
})
export class BlogCategoriesComponent implements OnInit {

  categories$ = this.sitePostService.categoriesAndPosts$;

  constructor(private sitePostService: SitePostService) { }

  ngOnInit(): void {
  }

}
