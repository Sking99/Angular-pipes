import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AdminComponent } from '../Components/admin-component/admin-component';

@Component({
  selector: 'app-root',
  imports: [AdminComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'Angular-pipes';
}
