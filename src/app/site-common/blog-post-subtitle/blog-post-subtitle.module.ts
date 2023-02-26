import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { SlugifyModule } from './../slugify/slugify.module';
import { BlogPostSubtitleComponent } from './blog-post-subtitle.component';

@NgModule({
    exports: [BlogPostSubtitleComponent],
    imports: [CommonModule, MatIconModule, RouterModule, SlugifyModule, BlogPostSubtitleComponent]
})
export class BlogPostSubtitleModule {}
