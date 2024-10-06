import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { catchError, interval, of, Subscription } from 'rxjs';

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
  maxAttempts: number = 5;
  errorMessage: string = '';

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.ipAddress = params['ip'];
      if (this.ipAddress) {
        this.startCheckingServerStatus();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.checkInterval) {
      this.checkInterval.unsubscribe();
    }
  }

  startCheckingServerStatus(): void {
    this.checkInterval = interval(1000).subscribe(() => {
      if (this.failedAttempts < this.maxAttempts) {
        this.checkServerStatus();
      } else {
        this.handleMaxAttemptsReached();
        if (this.checkInterval) {
          this.checkInterval.unsubscribe();
        }
      }
    });
  }

  checkServerStatus(): void {
    const serverUrl = `http://${this.ipAddress}`;

    this.http
      .get(serverUrl)
      .pipe(
        catchError((error) => {
          this.failedAttempts++;
          if (error.status === 0) {
            console.error('Network error or server is unreachable:', error);
          } else {
            console.error('Server returned an error:', error);
          }
          return of(null);
        })
      )
      .subscribe((response) => {
        if (response) {
          console.log('Server is reachable, navigating...');
          window.location.href = serverUrl;
          if (this.checkInterval) {
            this.checkInterval.unsubscribe(); 
          }
        }
      });
  }

  handleMaxAttemptsReached(): void {
    this.errorMessage = 'Server down. Something went wrong.';
    console.error(this.errorMessage);
  }

  tryAgain(): void {
    this.failedAttempts = 0;
    this.errorMessage = ''; 
    if (this.ipAddress) {
      this.startCheckingServerStatus(); 
    }
  }
}
