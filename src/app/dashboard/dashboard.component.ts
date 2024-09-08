import { Component } from '@angular/core';
import { SideBarComponent } from '../side-bar/side-bar.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SideBarComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  isUploadVisible = false;
  isUnavailableVisible = false;
  isAccountService = true;
  isVms = false;

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
}
