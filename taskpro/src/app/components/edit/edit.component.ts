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
calculateAge(value: any): any {

  const dob = value;
  console.log("DOB", dob)

  const newDate = new Date();
  const birthDate = new Date(dob);

  const birthyear = birthDate.getFullYear();
  const currentYear = newDate.getFullYear();

  let ageCalc = currentYear - birthyear;

  const birthMonth = birthDate.getMonth() + 1;
  const currentMonth = newDate.getMonth() + 1;

  if (birthMonth > currentMonth) {
    ageCalc = ageCalc - 1;
  }
  else if (birthMonth === currentMonth) {

    if (birthDate.getDate() > newDate.getDate()) {
      ageCalc = ageCalc - 1;
    }

  }

  return ageCalc;}


  constructor(private studentservice: StudentsService, private snackbar: SnackbarService, private productservice: ProductsService) { }

  student: any = {};
  products: any = {};
  studentClass: any = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  productCategories: any = ['Grocery', 'Gadgets', 'Electronics', 'Furniture'];
  updatedDOB: boolean = false;
  filteredClass: any[] = [];
  currentage: any;
  classAgeMap: any = {
    '1': { min: 5, max: 7 },
    '2': { min: 6, max: 8 },
    '3': { min: 7, max: 9 },
    '4': { min: 8, max: 10 },
    '5': { min: 9, max: 11 },
    '6': { min: 10, max: 12 },
    '7': { min: 11, max: 13 },
    '8': { min: 12, max: 14 },
    '9': { min: 13, max: 15 },
    '10': { min: 14, max: 16 },
    '11': { min: 15, max: 17 },
    '12': { min: 16, max: 18 }
  };
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

   
  changeEvent(event: any) {
    let value = event.target.value;
    this.updatedDOB = true;

    this.currentage = this.calculateAge(value);

    console.log('AGE:', this.currentage);

    this.filteredClass = this.studentClass.filter((cls: string) => {
      const range = this.classAgeMap[cls];
      return this.currentage >= range.min && this.currentage <= range.max;
    });

    console.log(this.filteredClass);
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
 
