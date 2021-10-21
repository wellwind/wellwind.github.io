import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { SlugifyPipe } from './slugify.pipe';
import { PaginationComponent } from './pagination/pagination.component';

@NgModule({
  declarations: [SlugifyPipe, PaginationComponent],
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule
  ],
  exports: [SlugifyPipe, PaginationComponent]
})
export class SiteCommonModule { }
