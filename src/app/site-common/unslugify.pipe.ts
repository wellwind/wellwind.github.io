import { Pipe, PipeTransform } from '@angular/core';

export const unslugify = (value: string) => value.replace(/[-]+/g, ' ')

@Pipe({
    name: 'unslugify',
    standalone: true
})
export class UnslugifyPipe implements PipeTransform {

  transform(value?: string): unknown {
    return unslugify(value || '');
  }

}
