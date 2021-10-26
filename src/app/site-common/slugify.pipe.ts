import { Pipe, PipeTransform } from '@angular/core';

export const slugify = (value: string) => value.replace(/[ ]+/g, '-')

@Pipe({
  name: 'slugify'
})
export class SlugifyPipe implements PipeTransform {

  transform(value?: string): string {
    return slugify(value || '');
  }

}
