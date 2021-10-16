import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-blog-post',
  templateUrl: './blog-post.component.html',
  styleUrls: ['./blog-post.component.scss']
})
export class BlogPostComponent implements OnInit {

  content$ = this.route.data.pipe(
    map(data => data.content as SafeHtml)
  );

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit(): void {

  }
}
