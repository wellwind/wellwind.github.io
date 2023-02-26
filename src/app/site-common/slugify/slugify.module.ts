import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SlugifyPipe } from './slugify.pipe';



@NgModule({
    exports: [SlugifyPipe],
    imports: [
        CommonModule,
        SlugifyPipe
    ]
})
export class SlugifyModule { }
