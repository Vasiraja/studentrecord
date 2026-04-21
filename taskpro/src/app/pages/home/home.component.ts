import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { SidebarService } from '../../services/sidebar.service';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../components/card/card.component';
import { TableviewComponent } from "../../components/tableview/tableview.component";
import { EditComponent } from "../../components/edit/edit.component";
import { StudentsService } from '../../services/students.service';
import { ProductsService } from '../../services/products.service';
import { ProfilecardComponent } from "../../components/profilecard/profilecard.component";
import { AddComponent } from "../../components/add/add.component";
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { StudentsideComponent } from '../../components/studentside/studentside.component';
import { ProductsideComponent } from "../../components/productside/productside.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SidebarComponent, CommonModule, CardComponent, TableviewComponent, EditComponent, ProfilecardComponent, AddComponent, NavbarComponent,
    StudentsideComponent, ProductsideComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent implements OnInit {
  itemSelect(data: any) {
    this.profileCard = true;

    this.profileDataH = data;
  }
  tableSelect(data: any) {
    this.profileCard = false;
    console.log("hh",)

    this.tableH = data;
    console.log(this.tableH)

  }
  ngOnInit(): void {
    this.profileCard = false;
    this.sidebarservice.sidebarState$.subscribe((data) => {
      this.sidebarStatus = data;
    });
    this.studentservice.studentEditComponent$.subscribe((data) => {
      console.log("status------->", data);
      this.editStatus = data;
    })
    this.productservice.productEditStatus$.subscribe((data) => {
      this.editStatus = data;
    })
    this.sidebarservice.profileCardTrigger$.subscribe((data) => {
      this.profileCard = data;
    })
    this.studentservice.AddComponent$.subscribe((data) => {
      this.studentSideView = data;
    })
    this.studentservice.AddComponentState$.subscribe((data) => {
      this.addState = data;
    })

  }

  sidebarStatus: boolean | undefined;
  editStatus: boolean | undefined;
  profileCard: boolean | undefined;
  addStatus: boolean | undefined;
  addState: any = "";
  profileDataH: any | undefined;
  tableH: any | undefined;


  studentSideView: boolean | undefined;
  productSideView: boolean | undefined;
  constructor(private sidebarservice: SidebarService, private studentservice: StudentsService, private productservice: ProductsService) { }


}
