import { PostDateAsPathPipe } from './post-date-as-path.pipe';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [PostDateAsPathPipe],
  exports: [PostDateAsPathPipe],
  imports: [
    CommonModule
  ]
})
export class PostDateAsPathModule { }
