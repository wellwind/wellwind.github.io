import { PostDateAsPathPipe } from './post-date-as-path.pipe';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
    exports: [PostDateAsPathPipe],
    imports: [
        CommonModule,
        PostDateAsPathPipe
    ]
})
export class PostDateAsPathModule { }
