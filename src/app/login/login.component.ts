import { FormsModule } from '@angular/forms';
import { LoginService } from './login.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, NO_ERRORS_SCHEMA, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  schemas: [NO_ERRORS_SCHEMA],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  errorMessage: string | null = null;

  constructor(private loginService: LoginService, private router: Router) {}

  ngOnInit() {
    if (typeof window !== 'undefined') {
      const currentUser = localStorage.getItem('user');
      if (currentUser) {
        this.router.navigate(['/dashboard']);
      }
    }
  }

  onLogin(): void {
    this.loginService.login(this.email, this.password).subscribe({
      next: (response) => {
        if (response.statusCode === 200) {
          localStorage.setItem('accessToken', response.data.tokens.accessToken);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage =
            'Login failed. Please check your credentials and try again.';
        }
      },
      error: (error) => {
        console.error('Login failed', error);
        this.errorMessage =
          'Login failed. Please check your credentials and try again.';
      },
    });
  }
}
