import { Component, EventEmitter, input, Input, output, Output, signal } from '@angular/core';
import { Student } from '../../Models/student';

@Component({
  selector: 'app-confirm-delete',
  imports: [],
  templateUrl: './confirm-delete.html',
  styleUrl: './confirm-delete.scss'
})
export class ConfirmDelete {

  userToDelete = input();
  userName = signal<string>('');
  OnConfirmation = output<boolean>();

  ngOnInit() {
    this.userName.set((this.userToDelete() as Student).name);
  }

  OnConfirmationBtmClicked(value: boolean){
    this.OnConfirmation.emit(value);
  }

}
