import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginService } from './login.service';
import { HttpClient } from '@angular/common/http';

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
  errorMessage: string | null = null;

  constructor(private loginService: LoginService) { }
  

  onLogin(): void {
    this.loginService.login(this.email, this.password).subscribe({
      next: (response) => {
        localStorage.setItem('accessToken', response.data.tokens.accessToken);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        console.log('Login successful', response);
      },
      error: (error) => {
        console.error('Login failed', error);
        this.errorMessage =
          'Login failed. Please check your credentials and try again.';
      },
    });
  }
}
