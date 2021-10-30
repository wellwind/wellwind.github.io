import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { slugify } from '../../../utils/slugify';
import { PostMetaWithSlug } from '../post-meta.interface';

@Pipe({
  name: 'postDateAsPath'
})
export class PostDateAsPathPipe implements PipeTransform {

  constructor(private domSanitizer: DomSanitizer) {
  }

  transform(post: PostMetaWithSlug): string[] {
    const dateFolder = post.date.slice(0, 10).replace(/-/g, '/');
    return ['/blog', ...dateFolder.split('/'), post.slug];
    //  return this.domSanitizer.bypassSecurityTrustUrl(input.slice(0, 10).replace(/-/g, '/'));``
  }

}
