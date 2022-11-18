import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BlogRoutingModule } from './blog-routing.module';
import { BlogLayoutComponent } from './blog-posts/blog-layout/blog-layout.component';

@NgModule({
  declarations: [
    BlogLayoutComponent,
  ],
  imports: [
    CommonModule,
    BlogRoutingModule,
    MatIconModule,
    MatButtonModule
  ]
})
export class BlogModule {
}
