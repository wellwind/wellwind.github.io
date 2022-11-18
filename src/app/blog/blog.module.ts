import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
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
