import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  apiurl = environment.apiurl + 'api/Transaction/';
  payment: any;
  constructor(private http: HttpClient) {}

  Get(): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user'));
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      }),
    };
    return this.http.get(this.apiurl + 'SdPayment', httpOptions);
  }
  GetLastPayment(): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user'));
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      }),
    };
    return this.http.get(this.apiurl + 'SdLastPayment', httpOptions);
  }
  GetTransac(CalYear: number, CalMonth: number): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user'));
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      }),
    };
    return this.http.get(this.apiurl + 'SdTransacs?CalYear=' + CalYear + '&CalMonth=' + CalMonth, httpOptions);
  }
}
