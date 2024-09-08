import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  // Function to handle the submission
  login = (): void => {
    console.log('Submitted data:', this.email, ' password', this.password);
    // Do something with the input data, like saving it to localStorage
    // localStorage.setItem('userInput', this.inputData);
  };
}
