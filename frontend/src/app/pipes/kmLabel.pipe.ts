import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'KmLabelPipe'
})

export class KmLabelPipe implements PipeTransform {

  transform(value: number, ...args: string[]): string {

    if (!value && value !== 0) return '';

    if (args && args.length > 0) {
      const mode = args[0].toLowerCase();

      if (mode === 'prefix') {
        return `Km ${value.toFixed(2)}`;
      } 
      else if (mode === 'postfix') {
        return `${value.toFixed(2)} Km`;
      }
    }
    return `${value}`;
  }

}
