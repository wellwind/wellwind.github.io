import { CommentComponent } from './comment.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [CommentComponent],
  exports: [CommentComponent],
  imports: [
    CommonModule
  ]
})
export class CommentModule { }
