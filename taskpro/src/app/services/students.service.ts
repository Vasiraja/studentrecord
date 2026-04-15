import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class StudentsService {
  apiUrl: string = "http://localhost:3030/students";

  studentEditData$ = new BehaviorSubject<any>(null);
  studentEditComponent$ = new BehaviorSubject<boolean>(false);


  AddComponent$ = new BehaviorSubject<boolean>(false);
  AddComponentState$ = new BehaviorSubject<string>('');


  constructor(private http: HttpClient) { }

  getStudents(): Observable<any> {

    return this.http.get(this.apiUrl);
  }
  setStudents(data: any) {


    let editStatus = this.studentEditComponent$.value;
    this.studentEditComponent$.next(!editStatus);
    editStatus = this.studentEditComponent$.value;




    if (editStatus) {
      this.studentEditData$.next(data);

    }

  }
  addNewStudent() {
    this.studentEditComponent$.next(true);

  }
  addStudent(studentdata: any) {


    return this.http.post(`${this.apiUrl}`, studentdata);

  }
  addTrigger() {
    this.AddComponent$.next(true);
    this.AddComponentState$.next("student");
    console.log(this.AddComponent$.value)

  }
  addProductTrigger() {
    this.AddComponent$.next(true);
    this.AddComponentState$.next("product");


  }

  removeAddTrigger() {
    this.AddComponent$.next(false);
    console.log(this.AddComponent$.value)
    this.AddComponentState$.next("");
  }
  updateStudents(id: any, data: any) {

    return this.http.patch(`${this.apiUrl}/${id}`, data);



  }
  delStudents(id: any) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  updatePhoto(id: any, base64String: any) {
    console.log(id);
    console.log("^^^^^");
    console.log(base64String);
    return this.http.patch(`${this.apiUrl}/${id}`, { profilePhoto: base64String });
  }
  deleteProfilePhoto(id: any) {

    return this.http.patch(`${this}apiUrl/${id}`, { delProfilePhoto: true })
  }
}
