import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  constructor() { }

   selectedNode$ = new Subject<any>();
  // selectedNode$ = this.selectedNode.asObservable();

  sidebarState$ = new BehaviorSubject<boolean>(true);

  sidebarOpen() {
    this.sidebarState$.next(!this.sidebarState$)

  }
  sendNode(data: any) {
    this.selectedNode$.next(data)
  }



}
