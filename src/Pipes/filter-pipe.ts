import { Pipe, PipeTransform } from '@angular/core';
import { Student } from '../Models/student';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(list: Student[], filterBy: string) {
    if(filterBy === 'All' || filterBy === '') {
      return list;
    }else{
      return list.filter((student: Student) => student.gender.toLowerCase() === filterBy.toLowerCase());
    }
  }

}
