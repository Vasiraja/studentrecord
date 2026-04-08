import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class StudentsService {
  apiUrl: string = "http://localhost:3030/students";

  constructor(private http: HttpClient) { }

  getStudents(): Observable<any> {

    return this.http.get(this.apiUrl);
  }
}
