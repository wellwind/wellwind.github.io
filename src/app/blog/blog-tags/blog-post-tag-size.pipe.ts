import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'blogPostTagSize',
    standalone: true
})
export class BlogPostTagSizePipe implements PipeTransform {

  transform(posts: number, max: number): number {
    if (posts >= max * 0.4) {
      return 1;
    }
    if (posts >= max * 0.2) {
      return 2;
    }
    if (posts >= max * 0.1) {
      return 3;
    }
    return 4;
  }

}
