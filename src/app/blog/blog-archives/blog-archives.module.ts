import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BlogArchivesRoutingModule } from './blog-archives-routing.module';
import { BlogArchivesComponent } from './blog-archives.component';

@NgModule({
  imports: [
    CommonModule,
    BlogArchivesRoutingModule,
    MatToolbarModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    BlogArchivesComponent,
  ],
})
export class BlogArchivesModule {}
