import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  constructor(private http: HttpClient) { }

  selectedNode$ = new BehaviorSubject<any>({ type: 'students' });
  profileCardTrigger$ = new BehaviorSubject<any>(false);
  profileCardData$ = new BehaviorSubject<any>(null);
  // selectedNode$ = this.selectedNode.asObservable();

  currentUser$ = new BehaviorSubject<any>(null);

  sidebarState$ = new BehaviorSubject<boolean>(true);

  apiUrl = "http://localhost:3030";
  sidebarOpen() {
    this.sidebarState$.next(!this.sidebarState$)

  }
  sendNode(data: any) {
    this.selectedNode$.next(data);

  }
  individualNodeGet(data: any): Observable<any> {

    switch (data?.type) {

      case "productsdbapi":
        return this.http.get(`${this.apiUrl}/products/${data.id}`);

      case "studentsapi":
        return this.http.get(`${this.apiUrl}/students/${data.id}`);

      case "productsapi":
        return this.http.get(`https://dummyjson.com/products/${data.id}`);

      default:
        return EMPTY;
    }
  }
  currentLoggedIn(user: any) {
    return this.currentUser$.next(user);
  }


  profileCardTrigger(data: any) {
    this.profileCardTrigger$.next(data);

  }
  profileDataObserve(data: any) {
    this.profileCardData$.next(data);

  }

}
