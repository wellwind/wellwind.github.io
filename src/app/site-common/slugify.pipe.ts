import { Pipe, PipeTransform } from '@angular/core';
import { slugify } from '@shared/core';

@Pipe({
  name: 'slugify',
})
export class SlugifyPipe implements PipeTransform {
  transform(value?: string): string {
    return slugify(value || '');
  }
}
