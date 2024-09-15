import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APP_SERVER_URL } from '../../shared/appBaseUrl';
import { CONFIGURE_SERVICE_ACCOUNT } from '../../shared/Apis';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private http: HttpClient) {}

  configureServiceAccount(
    serviceAccountJson: object,
    accessToken: string
  ): Observable<any> {
    const body = { serviceAccountJson };
    const endpoint = APP_SERVER_URL + CONFIGURE_SERVICE_ACCOUNT;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    });
    return this.http.post<any>(endpoint, body, { headers });
  }
}
