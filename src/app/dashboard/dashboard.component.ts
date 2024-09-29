import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import { SideBarComponent } from '../side-bar/side-bar.component';
import { DashboardService } from './dashboard.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ExtractZonePipe } from './pipe/extract-zone.pipe';

interface VmInstance {
  name: string;
  zone: string;
  status: string;
  networkInterfaces: Array<{
    accessConfigs: Array<{
      natIP: string;
    }>;
  }>;
}

interface HostedVm {
  hostedVm: string;
  url: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SideBarComponent, CommonModule, ExtractZonePipe],
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
  hostErrorMessage: string | null = null;
  message: string | null = null;
  loading = false;
  isConfigured = false;
  host = false;
  ipToHost = '';
  vms: VmInstance[] = [];
  hostedVms: HostedVm[] = [];
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
      this.dashboardService
        .getAllHostedVirtuelMachines(this.accessToken)
        .subscribe({
          next: (response) => {
            this.hostedVms = response;
            console.log(response);
          },
          error: (error) => {
            console.error('List failed', error);
            this.errorMessage = 'List failed. Somthing went wrong !';
            this.loading = false;
          },
        });
      this.dashboardService
        .listServiceAccountVirtuelMachines(this.accessToken)
        .subscribe({
          next: (response) => {
            this.vms = response.vms;
          },
          error: (error) => {
            console.error('List failed', error);
            this.errorMessage = 'List failed. Somthing went wrong !';
            this.loading = false;
          },
        });
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

  onHostVm(subdomain: string) {
    this.dashboardService
      .hostVirtuelMachine(this.accessToken, this.ipToHost, subdomain)
      .subscribe({
        next: (response) => {
          if (response.message === 'Subdomain assigned successfully') {
            this.hostedVms.push({
              hostedVm: this.ipToHost,
              url: `http://${subdomain}.example.com`,
            });
            this.host = false;
          }
          this.errorMessage = 'Something went wrong !';
        },
        error: (error) => {
          this.errorMessage = 'Something went wrong !';
        },
      });
  }

  onUnlinkVm(vmIp: string) {
    const url = this.getVmUrl(vmIp) as string;

    this.dashboardService
      .unlinkVirtuelMachine(this.accessToken, vmIp, url)
      .subscribe({
        next: (response) => {
          if (response.message === 'Subdomain unlinked successfully') {
            this.hostedVms = this.hostedVms.filter(
              (vm) => vm.hostedVm !== vmIp
            );
          }
        },
        error: (error) => {
          this.errorMessage = 'Something went wrong!';
          console.error('Unlink VM error:', error);
        },
      });
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

  showHostModal(ip: string) {
    this.ipToHost = ip;
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

  isHosted(ip: string): boolean {
    return this.hostedVms.some((hostedVm) => hostedVm.hostedVm === ip);
  }

  getVmUrl(ip: string): string | null {
    const hostedVm = this.hostedVms.find(
      (hostedVm) => hostedVm.hostedVm === ip
    );
    return hostedVm ? hostedVm.url : null;
  }
}
