import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ProductsService } from '../../services/products.service';
import { StudentsService } from '../../services/students.service';
import { MatFormField, MatFormFieldControl, MatLabel } from '@angular/material/form-field';
import { MatOption } from '@angular/material/core';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { MatCard, MatCardContent, MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-add',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormField, MatOption, MatLabel, MatTab, MatCard, MatCardContent, MatTabGroup
    , MatInputModule, MatButtonModule, MatSelectModule
  ],
  templateUrl: './add.component.html',
  styleUrl: './add.component.css'
})
export class AddComponent {

  classList = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  categories = ['Electronics', 'Groceries', 'Gadgets']

  products: any = {
    title: '',
    price: '',
    category: '',
    stock: '',
    overallrating: ''
  };

  student: any = {
    studentname: '',
    class: '',
    dob: '',
    gender: '',
  };
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
  constructor(
    private productservice: ProductsService,
    private studentservice: StudentsService,
    public snackbar: SnackbarService
  ) { }

  addProduct(form: NgForm) {
    console.log(this.products)
    this.productservice.addProduct(this.products).subscribe({
      next: (res: any) => {
        this.snackbar.openSnackBar("Product Added")
        this.resetForm(form);
      },
      error: (err: any) => {
        console.error(err);
      }
    });
  }

  addStudent(form: NgForm) {

    const age = this.calculateAge(this.student.dob);
    const selectedClass = this.student.class;

    const selectedone = this.classAgeMap[selectedClass];



    if (age < selectedone.min || age > selectedone.max) {
      alert('Age is not valid or this specific class');
      return;
    }

    this.studentservice.addStudent(this.student).subscribe({
      next: (res: any) => {
        console.log(res.studentname)
        this.snackbar.openSnackBar("Student Added");

        this.resetForm(form);
      },
      error: (err: any) => {
        console.error(err);
      }
    });
  }
  calculateAge(dob: string): number {

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

    return ageCalc;
  }
  resetForm(form: NgForm) {
    form.reset();
    this.products = { title: '', price: '', category: '', stock: '', overallrating: '' };
    this.student = { studentname: '', class: '', dob: '', gender: '' };
  }
}
