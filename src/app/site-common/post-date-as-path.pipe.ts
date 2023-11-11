import { Pipe, PipeTransform } from '@angular/core';
import { PostMetaWithSlug } from './post-meta.interface';

@Pipe({
    name: 'postDateAsPath',
    standalone: true
})
export class PostDateAsPathPipe implements PipeTransform {

  transform(post: PostMetaWithSlug): string[] {
    const dateFolder = post.date.slice(0, 10).replace(/-/g, '/');
    return ['/blog', ...dateFolder.split('/'), post.slug];
  }

}
