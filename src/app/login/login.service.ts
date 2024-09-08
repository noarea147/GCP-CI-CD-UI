import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APP_SERVER_URL } from '../../shared/appBaseUrl';
import { LOGIN } from '../../shared/Apis';

@Injectable({
  providedIn: 'root',
})
export class loginService {
  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    const body = { email, password };
    const endpoint = APP_SERVER_URL + LOGIN;
    return this.http.post<any>(endpoint, body);
  }
}
