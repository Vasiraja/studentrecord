import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatTable, MatTableModule } from '@angular/material/table'
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { MatToolbar } from '@angular/material/toolbar';
import { ProductsService } from '../../services/products.service';
import { StudentsService } from '../../services/students.service';
import { forkJoin } from 'rxjs';
import { SidebarService } from '../../services/sidebar.service';
import { MatIcon } from '@angular/material/icon';
import { SnackbarService } from '../../services/snackbar.service';
@Component({
  selector: 'app-tableview',
  standalone: true,
  imports: [MatTableModule, MatTable, MatTab, MatTabGroup, MatToolbar, MatIcon],
  templateUrl: './tableview.component.html',
  styleUrl: './tableview.component.css'
})
export class TableviewComponent implements AfterViewInit {
  addStudent() {
    throw new Error('Method not implemented.');
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

  productsApi: any[] = [];
  products: any[] = [];
  students: any[] = [];

  productApiColumns: string[] = ['id', 'title', 'rating', 'category', 'stock', 'price'];
  productDbColumns: string[] = ['id', 'name', 'category', 'stock', 'overAllRating', 'price'];
  studentColumns: string[] = ['id', 'name', 'dob', 'class', 'gender', 'age', 'actions'];
  selectedTabIndex: number | undefined;
  constructor(private productservice: ProductsService, private studentservice: StudentsService, private sidebarservice: SidebarService, private snackbar: SnackbarService,private cdr:ChangeDetectorRef) { }


  ngAfterViewInit(): void {

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

  initialAllData() {
    const productfetch = this.productservice.getThirdpartyProducts();
    const productDbFetch = this.productservice.getProducts();
    const studentfetch = this.studentservice.getStudents();


    forkJoin({ productfetch, productDbFetch, studentfetch }).subscribe({
      next: (res: any) => {
        this.productsApi = res.productfetch.products;
        this.products = res.productDbFetch.data;
        this.students = res.studentfetch.data;
      }
    })

  }

}
