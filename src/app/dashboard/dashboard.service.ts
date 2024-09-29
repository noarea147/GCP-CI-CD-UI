import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APP_SERVER_URL } from '../../shared/appBaseUrl';
import {
  CONFIGURE_SERVICE_ACCOUNT,
  GET_VIRTUEL_MACHINES,
  HOST_VIRTUEL_MACHINE,
  LIST_VIRTUEL_MACHINES,
  UNLINK_VIRTUEL_MACHINE,
} from '../../shared/Apis';

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

  listServiceAccountVirtuelMachines(accessToken: string): Observable<any> {
    const endpoint = APP_SERVER_URL + LIST_VIRTUEL_MACHINES;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    });
    return this.http.post<any>(endpoint, {}, { headers });
  }

  hostVirtuelMachine(
    accessToken: string,
    vmIp: string,
    subdomain: string
  ): Observable<any> {
    const endpoint = APP_SERVER_URL + HOST_VIRTUEL_MACHINE;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    });
    return this.http.post<any>(
      endpoint,
      { vmIp: vmIp, subdomain: subdomain },
      { headers }
    );
  }

  unlinkVirtuelMachine(
    accessToken: string,
    vmIp: string,
    url: string
  ): Observable<any> {
    const endpoint = APP_SERVER_URL + UNLINK_VIRTUEL_MACHINE;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    });
    return this.http.post<any>(endpoint, { vmIp: vmIp, url: url }, { headers });
  }

  getAllHostedVirtuelMachines(accessToken: string): Observable<any> {
    const endpoint = APP_SERVER_URL + GET_VIRTUEL_MACHINES;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    });
    return this.http.post<any>(endpoint, {}, { headers });
  }
}
