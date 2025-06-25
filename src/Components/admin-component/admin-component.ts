import { Component, ComponentRef, ElementRef, inject, signal, viewChild, ViewChild, ViewContainerRef } from '@angular/core';
import { Student } from '../../Models/student';
import { StudentService } from '../../Services/student-service';
import { AsyncPipe, CurrencyPipe, DatePipe, NgFor, NgIf, PercentPipe } from '@angular/common';
import { PercentagePipePipe } from '../../Pipes/percentage-pipe-pipe';
import { FormsModule } from '@angular/forms';
import { FilterPipe } from '../../Pipes/filter-pipe';
import { ConfirmDelete } from '../confirm-delete/confirm-delete';
import { single } from 'rxjs';

@Component({
  selector: 'app-admin-component',
  imports: [NgIf, CurrencyPipe, DatePipe, PercentagePipePipe, FormsModule, AsyncPipe],
  templateUrl: './admin-component.html',
  styleUrl: './admin-component.scss'
})
export class AdminComponent {
  studentService: StudentService = inject(StudentService);

  vcr = viewChild('container', { read: ViewContainerRef });
  #componentRef?: ComponentRef<ConfirmDelete>;

  createComponent(){
    this.vcr()?.clear();
    this.#componentRef = this.vcr()?.createComponent(ConfirmDelete);
    this.#componentRef?.setInput('userToDelete', this.userToDelete());
    this.#componentRef?.instance.OnConfirmation.subscribe((value: boolean) => {
      if(value) {
      const index = this.studentService.students.indexOf(this.userToDelete() as Student);
      this.studentService.students.splice(index, 1);
      this.students = this.studentService.filterStudents(this.selectedGender);
      this.userToDelete.set(null);
      this.vcr()?.clear();
    }
    else {
      this.userToDelete.set(null);
      this.vcr()?.clear();
    }
    })
  }

  destroyComponent(){

  }

  isEditing: boolean = false;
  isInserting: boolean = false;
  stdIdToEdit!: number;
  userToDelete = signal<Student | null>(null);
  showDeletePopup = signal(false);

  students!: Student[];
  totalMarks!: number;
  selectedGender: string = 'All';

  totalStudents = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(this.studentService.students.length);
    }, 2000);
  });
  
  //PROPERTIES FOR INSERTING
  @ViewChild('name') Name!: ElementRef;
  @ViewChild('gender') Gender!: ElementRef;
  @ViewChild('dob') Dob!: ElementRef;
  @ViewChild('course') Course!: ElementRef;
  @ViewChild('marks') Marks!: ElementRef;
  @ViewChild('fee') Fee!: ElementRef;

  //PROPERTIES FOR EDITING
  @ViewChild('editName') editName!: ElementRef;
  @ViewChild('editGender') editGender!: ElementRef;
  @ViewChild('editDob') editDob!: ElementRef;
  @ViewChild('editCourse') editCourse!: ElementRef;
  @ViewChild('editMarks') editMarks!: ElementRef;
  @ViewChild('editFee') editFee!: ElementRef;

  ngOnInit(){
    this.students = this.studentService.filterStudents(this.selectedGender);
    this.totalMarks = this.studentService.totalMarks;
  }

  OnFilterChanged(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.selectedGender = filterValue;
    this.students = this.studentService.filterStudents(filterValue);
  }

  OnInsertClicked(){
    this.isInserting = true;
  }
  OnInsertCancelled(){
    this.isInserting = false;
  }
  OnInsertSaved(){
    this.studentService.CreateStudent(
      this.Name.nativeElement.value, 
      this.Gender.nativeElement.value, 
      this.Dob.nativeElement.value, 
      this.Course.nativeElement.value, 
      this.Marks.nativeElement.value, 
      this.Fee.nativeElement.value
    );
    this.isInserting = false;
    this.students = this.studentService.filterStudents(this.selectedGender);
  }

  OnEditClicked(stdId: number){
    this.isEditing = true;
    this.stdIdToEdit = stdId;
  }
  OnEditCancelled(){
    this.isEditing = false;
  }

  OnEditSaved(student: Student){
      student.name = this.editName.nativeElement.value; 
      student.gender = this.editGender.nativeElement.value; 
      student.dob = this.editDob.nativeElement.value; 
      student.course = this.editCourse.nativeElement.value; 
      student.marks = this.editMarks.nativeElement.value; 
      student.fee = this.editFee.nativeElement.value;

      this.isEditing = false;
      this.students = this.studentService.filterStudents(this.selectedGender);
  }

  onDeleteClicked(student: Student){
    this.userToDelete.set(student);
    this.createComponent();
  }

  showDeleteModal(value: boolean) {
    if(value) {
      const index = this.studentService.students.indexOf(this.userToDelete() as Student);
      this.studentService.students.splice(index, 1);
      this.students = this.studentService.filterStudents(this.selectedGender);
      this.userToDelete.set(null);
      this.showDeletePopup.set(!value);
    }
    else {
      this.userToDelete.set(null);
      this.showDeletePopup.set(value);
    }
  }
}
