import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { PushModule } from '@rx-angular/template/push';



import { BlogPostsRoutingModule } from './blog-posts-routing.module';
import { BlogPostsComponent } from './blog-posts.component';

@NgModule({
    imports: [
    CommonModule,
    BlogPostsRoutingModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatRippleModule,
    PushModule,
    BlogPostsComponent
]
})
export class BlogPostsModule {}
