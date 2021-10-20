import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SlugifyPipe } from './slugify.pipe';

@NgModule({
  declarations: [SlugifyPipe],
  imports: [
    CommonModule
  ],
  exports: [SlugifyPipe]
})
export class SiteCommonModule { }
