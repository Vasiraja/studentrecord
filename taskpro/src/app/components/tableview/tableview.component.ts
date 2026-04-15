import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatTable, MatTableModule } from '@angular/material/table';
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
  imports: [MatTableModule, MatTable, MatToolbar, MatButton, CommonModule],
  templateUrl: './tableview.component.html',
  styleUrl: './tableview.component.css'
})
export class TableviewComponent implements AfterViewInit, OnInit {

  photoUrl!: SafeUrl;

  selectedView: any = '';

  productsApi: any[] = [];
  products: any[] = [];
  students: any[] = [];

  productApiColumns: string[] = ['id', 'title', 'rating', 'category', 'stock', 'price'];
  productDbColumns: string[] = ['photo', 'id', 'name', 'category', 'stock', 'overallrating', 'price', 'actions'];
  studentColumns: string[] = ['photo', 'id', 'name', 'dob', 'class', 'gender', 'age', 'actions'];

  sortingtoggle: boolean | undefined;

  constructor(
    private productservice: ProductsService,
    private studentservice: StudentsService,
    private sidebarservice: SidebarService,
    private snackbar: SnackbarService,
    private sanitizer: DomSanitizer
  ) { }
  ngOnInit(): void {
    this.selectedView = 'students';
    this.sidebarservice.selectedNode$.subscribe((data: any) => {
      if (data?.type === 'products') {
        
        this.selectedView = 'products';
      } else if (data?.type === 'productdb') {
        this.selectedView = 'productdb';
      } else if (data?.type === 'students') {
        this.selectedView = 'students';
      }
    })


  }

  ngAfterViewInit(): void {
    this.sidebarservice.profileCardTrigger$.next(false);
    this.initialAllData();

    this.sidebarservice.selectedNode$.subscribe((data: any) => {
      if (data?.type === 'products') {
        this.selectedView = 'products';
      } else if (data?.type === 'productdb') {
        this.selectedView = 'productdb';
      } else if (data?.type === 'students') {
        this.selectedView = 'students';
      }
    });
  }

  formateImg(imgString: any): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(imgString);
  }

  addProduct() {
    this.studentservice.addProductTrigger();
  }

  addStudent() {
    this.studentservice.addTrigger();
  }

  editStudent(data: any) {
    this.studentservice.setStudents(data);
  }

  deleteStudent(id: any) {
    this.studentservice.delStudents(id).subscribe({
      next: () => {
        this.snackbar.openSnackBar('user deleted');
        this.initialAllData();
      }
    });
  }

  deleteProducts(id: any) {
    this.productservice.deleteProducts(id).subscribe({
      next: () => {
        this.snackbar.openSnackBar('product deleted');
        this.initialAllData();
      }
    });
  }

  editProducts(data: any) {
    this.productservice.sendProducts(data);
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
    });
  }
}