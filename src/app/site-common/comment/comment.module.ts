import { CommentComponent } from './comment.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
    exports: [CommentComponent],
    imports: [
        CommonModule,
        CommentComponent
    ]
})
export class CommentModule { }
