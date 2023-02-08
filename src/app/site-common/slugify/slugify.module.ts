import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SlugifyPipe } from './slugify.pipe';



@NgModule({
  declarations: [SlugifyPipe],
  exports: [SlugifyPipe],
  imports: [
    CommonModule
  ]
})
export class SlugifyModule { }
