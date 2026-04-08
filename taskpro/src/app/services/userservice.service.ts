import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserserviceService {

  apiUrl: string = 'http://localhost:3030/users';
  apiAuthentication: string = "http://localhost:3030/authentication"
  constructor(private http: HttpClient) {



  }

  loginUser(email: string, password: string): Observable<any> {
    return this.http.post(this.apiAuthentication, { email, password, strategy: "local" });
  }
  signupUser(email: string, password: string, firstname: string): Observable<any> {
    console.log(email,password,firstname);
    return this.http.post(this.apiUrl, { email, password, firstname });
  }



}
