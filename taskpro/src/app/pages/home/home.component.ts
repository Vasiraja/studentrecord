import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { SidebarService } from '../../services/sidebar.service';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../components/card/card.component';
import { TableviewComponent } from "../../components/tableview/tableview.component";
import { EditComponent } from "../../components/edit/edit.component";
import { StudentsService } from '../../services/students.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SidebarComponent, CommonModule, CardComponent, TableviewComponent, EditComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent implements OnInit {
  ngOnInit(): void {
    this.sidebarservice.sidebarState$.subscribe((data) => {
      this.sidebarStatus = data;
    });
    this.studentservice.studentEditComponent$.subscribe((data) => {
      this.editStatus = data;
    })
  }

  sidebarStatus: boolean | undefined;
  editStatus: boolean | undefined;
  constructor(private sidebarservice: SidebarService, private studentservice: StudentsService) { }
}
