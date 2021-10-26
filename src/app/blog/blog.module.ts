import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogRoutingModule } from './blog-routing.module';
import { BlogLayoutComponent } from './blog-posts/blog-layout/blog-layout.component';

@NgModule({
  declarations: [
    BlogLayoutComponent
  ],
  imports: [
    CommonModule,
    BlogRoutingModule
  ]
})
export class BlogModule {
}
