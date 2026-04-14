import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatOption } from '@angular/material/core';
import { MatFormField, MatFormFieldControl, MatLabel } from '@angular/material/form-field';
import { StudentsService } from '../../services/students.service';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatSelect } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SnackbarService } from '../../services/snackbar.service';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [MatCardModule, FormsModule, MatLabel, MatFormField, MatOption, MatInput, MatButton, MatSelect, CommonModule, DragDropModule],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css'
})
export class EditComponent implements OnInit {


  constructor(private studentservice: StudentsService, private snackbar: SnackbarService, private productservice: ProductsService) { }

  student: any = {};
  products: any = {};
  studentClass: any = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  productCategories: any = ['Grocery', 'Gadgets', 'Electronics']
  ngOnInit(): void {

    this.studentservice.studentEditData$.subscribe({
      next: (data: any) => {
        if (!data || !data.studentname) return
        this.products = {};
        this.student = data;


        console.log(data);

      },
      error: (error: any) => {
        console.error(error)
      }
    })

    this.productservice.productValue$.subscribe({
      next: (data: any) => {
        if (!data || !data.title) return
        this.student = {};
        this.products = data;

      },
      error: (err: any) => {
        console.error(err)
      }
    })

  }

  resetForm() {

  }
  changeEvent(event: any) {
    console.log(event.target.value);

  }
  saveStudent(id: any) {
    console.log(id);
    console.log(this.student);
    delete this.student.age;
    this.studentservice.updateStudents(id, this.student).subscribe({
      next: (res: any) => {
        console.log(res.age + "Updated Successfully");
        console.log(res);
        this.snackbar.openSnackBar("Updated Successfully");
        if (res.age) {
          this.student.age = res.age;
          this.studentservice.studentEditComponent$.next(false);
          // this.studentservice.studentEditComponent$.next(true);


        }

      },
      error: (err: any) => {
        console.error(err)
      }
    })
  }
  saveProduct(id: any) {

    this.productservice.updateProducts(id, this.products).subscribe({
      next: (res: any) => {
        console.log(res);
        this.snackbar.openSnackBar("Product Updated");
        this.productservice.productEditStatus$.next(false);

      },
      error: (err: any) => {
        console.error(err);

      }
    })
  }

  cancelForm() {
    this.studentservice.studentEditComponent$.next(false);
    this.productservice.productEditStatus$.next(false);

    this.studentservice.studentEditData$.next(null);
    this.productservice.productValue$.next(null);

    this.student = {};
    this.products = {};
  }
  addDetails() {
    
  }
}
