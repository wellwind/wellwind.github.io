import { Pipe, PipeTransform } from '@angular/core';
import { PostMetaWithSlug } from '../post-meta.interface';

@Pipe({
  name: 'postDateAsPath'
})
export class PostDateAsPathPipe implements PipeTransform {

  constructor() {
  }

  transform(post: PostMetaWithSlug): string[] {
    const dateFolder = post.date.slice(0, 10).replace(/-/g, '/');
    return ['/blog', ...dateFolder.split('/'), post.slug];
  }

}
