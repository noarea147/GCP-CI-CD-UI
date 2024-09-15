import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import { SideBarComponent } from '../side-bar/side-bar.component';
import { DashboardService } from './dashboard.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SideBarComponent, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  isUploadVisible = false;
  isUnavailableVisible = false;
  isAccountService = true;
  isVms = false;
  currentUser: string | null = null;
  accessToken = '';
  serviceAccountJson: object | null = null;
  errorMessage: string | null = null;
  message: string | null = null;
  loading = false;
  isConfigured = false;
  host = false;

  constructor(
    private router: Router,
    private dashboardService: DashboardService
  ) {}

  ngOnInit() {
    if (typeof window !== 'undefined') {
      this.currentUser = localStorage.getItem('user');
      this.accessToken = localStorage.getItem('accessToken') as string;
      if (!this.currentUser) {
        this.router.navigate(['/']);
      }
      this.isConfigured = JSON.parse(this.currentUser as string).isConfigured;
    }
  }

  onConfigureServiceAccount() {
    if (this.serviceAccountJson) {
      this.loading = true;
      this.dashboardService
        .configureServiceAccount(this.serviceAccountJson, this.accessToken)
        .subscribe({
          next: (response) => {
            this.message = response.message;
            this.loading = false;
            if (
              response.message === 'Service account configured successfully'
            ) {
              let newUser = JSON.parse(this.currentUser as string);
              newUser.isConfigured = true;
              localStorage.setItem('user', JSON.stringify(newUser));
            }
          },
          error: (error) => {
            console.error('Login failed', error);
            this.errorMessage =
              'Login failed. Please check your credentials and try again.';
            this.loading = false;
          },
        });
    }
  }

  showUploadInput() {
    this.isUnavailableVisible = false;
    this.isUploadVisible = true;
  }

  showUnavailableInput() {
    this.isUploadVisible = false;
    this.isUnavailableVisible = true;
  }

  showAccountService() {
    this.isVms = false;
    this.isAccountService = true;
  }

  showVMs() {
    this.isVms = true;
    this.isAccountService = false;
  }

  showHostModal() {
    this.host = true;
  }

  hideHostModal() {
    this.host = false;
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    this.router.navigate(['/']);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        try {
          const json = JSON.parse(e.target?.result as string);
          this.serviceAccountJson = json;
          this.onConfigureServiceAccount();
        } catch (err) {
          console.error('Error parsing JSON:', err);
          this.errorMessage = 'Invalid JSON file. Please try again.';
        }
      };
      reader.readAsText(file);
    }
  }
}
