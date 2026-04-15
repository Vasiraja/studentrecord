import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatTable, MatTableModule } from '@angular/material/table'
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { MatToolbar } from '@angular/material/toolbar';
import { ProductsService } from '../../services/products.service';
import { StudentsService } from '../../services/students.service';
import { forkJoin } from 'rxjs';
import { SidebarService } from '../../services/sidebar.service';
import { SnackbarService } from '../../services/snackbar.service';
import { MatButton } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-tableview',
  standalone: true,
  imports: [MatTableModule, MatTable, MatTab, MatTabGroup, MatToolbar, MatButton, CommonModule],
  templateUrl: './tableview.component.html',
  styleUrl: './tableview.component.css'
})
export class TableviewComponent implements AfterViewInit {


  photoUrl!: SafeUrl;



  formateImg(imgString: any): any {

    this.photoUrl = this.sanitizer.bypassSecurityTrustUrl(
      imgString
    )

    return this.photoUrl;

  }
  addProduct() {
    this.studentservice.addProductTrigger();

  }

  addStudent() {
    this.studentservice.addTrigger();


  }
  editStudent(data: any) {

    this.studentservice.setStudents(data)
  }
  deleteStudent(id: any) {
    this.studentservice.delStudents(id).subscribe({
      next: (data: any) => {
        console.log(data);
        this.snackbar.openSnackBar("user deleted");
        this.initialAllData();


      }
    })
  }
  deleteProducts(id: any) {
    this.productservice.deleteProducts(id).subscribe({
      next: (data: any) => {
        console.log(data);
        this.snackbar.openSnackBar("product delted");
        this.initialAllData();
      }
    })
  }
  editProducts(data: any) {
    this.productservice.sendProducts(data);
  }

  productsApi: any[] = [];
  products: any[] = [];
  students: any[] = [];

  productApiColumns: string[] = ['id', 'title', 'rating', 'category', 'stock', 'price'];
  productDbColumns: string[] = ['photo', 'id', 'name', 'category', 'stock', 'overallrating', 'price', 'actions'];
  studentColumns: string[] = ['photo', 'id', 'name', 'dob', 'class', 'gender', 'age', 'actions'];
  selectedTabIndex: number | undefined;
  constructor(private productservice: ProductsService, private studentservice: StudentsService, private sidebarservice: SidebarService, private snackbar: SnackbarService, private cdr: ChangeDetectorRef, private sanitizer: DomSanitizer) { }


  ngAfterViewInit(): void {
    this.sidebarservice.profileCardTrigger$.next(false);

    this.initialAllData();

    this.sidebarservice.selectedNode$.subscribe((data: any) => {

      if (data.type === "products") {
        console.log(data.type)
        console.log(this.selectedTabIndex)
        this.selectedTabIndex = 1;
      } else if (data.type === "productdb") {
        this.selectedTabIndex = 2
      } else if (data.type === "students") {
        this.selectedTabIndex = 0
      }
    })
  }
  sortingtoggle: boolean | undefined;

  sortbyname() {
    console.log(this.students)
    if (!this.sortingtoggle) {
      this.students = [...this.students].sort((a, b) => a.age - b.age);
      this.sortingtoggle = true;



    }
    else {
      this.students = [...this.students].sort((a, b) => b.age - a.age)
      this.sortingtoggle = false;


    }
    return this.students;

  }

  initialAllData() {
    const productfetch = this.productservice.getThirdpartyProducts();
    const productDbFetch = this.productservice.getProducts();
    const studentfetch = this.studentservice.getStudents();


    forkJoin({ productfetch, productDbFetch, studentfetch }).subscribe({
      next: (res: any) => {
        console.log(res.productDbFetch);
        console.log(res.studentfetch)
        this.productsApi = res.productfetch.products;
        this.products = res.productDbFetch.data;
        this.students = res.studentfetch.data;
      }
    })

  }

}
