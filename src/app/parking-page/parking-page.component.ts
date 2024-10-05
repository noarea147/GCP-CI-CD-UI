import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-parking-page',
  standalone: true,
  imports: [],
  templateUrl: './parking-page.component.html',
  styleUrl: './parking-page.component.css',
})
export class ParkingPageComponent {
  ipAddress: string | null = null;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.ipAddress = params['ip'];
    });
  }

  tryAgain() {
    this.router.navigate([this.ipAddress]);
  }
}
