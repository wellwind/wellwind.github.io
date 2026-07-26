import { Pipe, PipeTransform } from '@angular/core';

export const unslugify = (value: string) =>
  value
    .replace(/~23~/gi, '#')
    .replace(/~2a~/gi, '*')
    .replace(/[-]+/g, ' ');

@Pipe({
  name: 'unslugify',
})
export class UnslugifyPipe implements PipeTransform {
  transform(value?: string): unknown {
    return unslugify(value || '');
  }
}
