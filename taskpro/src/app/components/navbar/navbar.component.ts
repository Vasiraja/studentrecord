import { Component, EventEmitter, Output } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon'
import { SidebarService } from '../../services/sidebar.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatToolbarModule, MatIcon],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  sideBarState: boolean | undefined;

  constructor(private sidebarserv: SidebarService) { }

  sidebarAction() {
    this.sideBarState = this.sidebarserv.sidebarState$.value;
    this.sidebarserv.sidebarState$.next(!this.sideBarState);
    this.sideBarState = this.sidebarserv.sidebarState$.value;


    console.log(this.sideBarState)

  }




}
