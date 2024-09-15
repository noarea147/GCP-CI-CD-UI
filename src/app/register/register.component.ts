import { Component } from '@angular/core';
import { RegisterService } from './register.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  email: string = '';
  password: string | null = null;
  confirmPassword: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private registerService: RegisterService,
    private router: Router
  ) {}

  ngOnInit() {
    if (typeof window !== 'undefined') {
      const currentUser = localStorage.getItem('user');
      if (currentUser) {
        this.router.navigate(['/dashboard']);
      }
    }
  }

  onRegister(): void {
    if (this.email && this.password && this.password === this.confirmPassword) {
      this.registerService.register(this.email, this.password).subscribe({
        next: (response) => {
          if (response.statusCode === 200) {
            localStorage.setItem(
              'accessToken',
              response.data.tokens.accessToken
            );
            localStorage.setItem('user', JSON.stringify(response.data.user));
            this.router.navigate(['/dashboard']);
          } else {
            this.errorMessage =
              'Register failed. Please check your form input and try again.';
          }
        },
        error: (error) => {
          console.error('Register failed', error);
          this.errorMessage =
            'Register failed. Please check your credentials and try again.';
        },
      });
    } else {
      this.errorMessage = "Passwords doesn't match !";
    }
  }
}
