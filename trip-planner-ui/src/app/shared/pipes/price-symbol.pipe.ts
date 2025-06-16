import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'priceSymbol'
})
export class PriceSymbolPipe implements PipeTransform {

  transform(value: string | null | undefined): string {
    if (!value) return '';

    switch (value.toLowerCase()) {
      case 'small':
        return '$';
      case 'moderate':
        return '$$';
      case 'big':
        return '$$$';
      case 'unknown':
        return '';
      default:
        return value;
    }
  }

}
