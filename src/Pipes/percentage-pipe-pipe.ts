import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'percentagePipe'
})
export class PercentagePipePipe implements PipeTransform {

  transform(value: number, total: number, decimal: number = 2) {
    return (value/total * 100).toFixed(decimal)+ '%';
  }

}
