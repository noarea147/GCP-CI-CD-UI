import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APP_SERVER_URL } from '../../shared/appBaseUrl';
import { REGISTER } from '../../shared/Apis';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  constructor(private http: HttpClient) {}

  register(email: string, password: string): Observable<any> {
    const body = { email, password };
    const endpoint = APP_SERVER_URL + REGISTER;
    return this.http.post<any>(endpoint, body);
  }
}
