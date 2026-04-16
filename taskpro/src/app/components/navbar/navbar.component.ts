import { AfterContentChecked, AfterContentInit, AfterViewInit, ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon'
import { SidebarService } from '../../services/sidebar.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatToolbarModule, MatIcon, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

  sideBarState: boolean | undefined;
  currentUser: any;

  constructor(private sidebarserv: SidebarService, public router: Router, private cdr: ChangeDetectorRef) { }
  ngOnInit(): void {
    console.log("-------------------------------------")
    this.sidebarserv.currentUser$.subscribe({
      next: (res: any) => {
        this.currentUser = res
      },
      error: (err: any) => {
        console.error("user not found", err)
      }
    })
    this.currentUser = this.sidebarserv.currentUser$.value;

    console.log("navcurrentuser", this.currentUser)
  }

  sidebarAction() {
    this.sideBarState = this.sidebarserv.sidebarState$.value;
    this.sidebarserv.sidebarState$.next(!this.sideBarState);
    this.sideBarState = this.sidebarserv.sidebarState$.value;


    console.log(this.sideBarState)

  }

  async logoutAction() {
    const token = localStorage.getItem("token");
    if (token) {
      await localStorage.removeItem("token");
      this.router.navigate(['/login'])
    }




  }




}
