import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DashboardService } from '../dashboard/dashboard.service';

interface HostedVm {
  hostedVm: string;
  url: string;
  name: string;
}

@Component({
  selector: 'app-parking-page',
  standalone: true,
  imports: [],
  templateUrl: './parking-page.component.html',
  styleUrls: ['./parking-page.component.css'],
})
export class ParkingPageComponent {
  ipAddress: string | null = null;
  checkInterval: Subscription | null = null;
  failedAttempts: number = 0;
  maxAttempts: number = 1;
  errorMessage: string = '';
  currentUser: string | null = null;
  accessToken = '';
  serverStatus: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.currentUser = localStorage.getItem('user');
      this.accessToken = localStorage.getItem('accessToken') as string;
      if (!this.currentUser) {
        this.router.navigate(['/']);
      }
      this.checkServerStatus();
    }
  }

  checkServerStatus() {
    this.route.queryParams.subscribe((params) => {
      this.ipAddress = params['ip'];
      if (this.ipAddress) {
        this.dashboardService
          .getVirtuelMachineByIp(this.accessToken, this.ipAddress)
          .subscribe({
            next: (response) => {
              if (response.status === 'RUNNING') {
                this.redirectToOriginalUrl();
              } else if (response.status === 'TERMINATED') {
                this.startVm(response.name);
              } else {
                setTimeout(() => {
                  this.checkServerStatus();
                }, 5000);
                this.errorMessage = 'we are working on it please wait ...';
              }
            },
            error: (error) => {
              console.error('List failed', error);
              this.errorMessage = 'List failed. Somthing went wrong !';
            },
          });
      }
    });
  }

  startVm(vmName: string) {
    this.dashboardService
      .startVirtuelMachine(vmName, this.accessToken)
      .subscribe({
        next: (response) => {
          console.log(response);
        },
        error: (error) => {
          console.error('Login failed', error);
          this.errorMessage =
            'Login failed. Please check your credentials and try again.';
        },
      });
    setTimeout(() => {
      this.checkServerStatus();
    }, 5000);
  }
  redirectToOriginalUrl() {
    this.dashboardService
      .getAllHostedVirtuelMachines(this.accessToken)
      .subscribe({
        next: (response) => {
          let url = this.getHostedUrl(response);
          window.location.href = url as string;
        },
        error: (error) => {
          console.error('List failed', error);
          this.errorMessage = 'List failed. Somthing went wrong !';
        },
      });
  }

  getHostedUrl(hostedVms: HostedVm[]): string | null {
    const targetVm = hostedVms.find((hostedVm: HostedVm) => {
      return hostedVm.hostedVm === this.ipAddress;
    });
    return targetVm ? targetVm.url : null;
  }
}
