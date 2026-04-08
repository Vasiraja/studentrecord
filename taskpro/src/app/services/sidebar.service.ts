import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  constructor() { }

  sidebarState$ = new BehaviorSubject<boolean>(false);

  sidebarOpen() {
    this.sidebarState$.next(!this.sidebarState$)

  }

}
