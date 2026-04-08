import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { SidebarService } from '../../services/sidebar.service';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../components/card/card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SidebarComponent,CommonModule,CardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent implements OnInit {
  ngOnInit(): void {
    this.sidebarservice.sidebarState$.subscribe((data) => {
      this.sidebarStatus = data;
    });
  }

  sidebarStatus: boolean | undefined;
  constructor(private sidebarservice: SidebarService) { }
}
