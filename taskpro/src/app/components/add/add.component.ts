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

  constructor(
    private productservice: ProductsService,
    private studentservice: StudentsService
  ) { }

  onSubmitProduct(form: NgForm) {
    if (form.invalid) return;
    console.log(this.products)
    this.productservice.addProduct(this.products).subscribe({
      next: (res: any) => {
        console.log('Product added', res);
        this.resetForm(form);
      },
      error: (err: any) => {
        console.error(err);
      }
    });
  }

  onSubmitStudent(form: NgForm) {
    if (form.invalid) return;
    this.studentservice.addStudent(this.student).subscribe({
      next: (res: any) => {
        console.log('Student added', res);
        this.resetForm(form);
      },
      error: (err: any) => {
        console.error(err);
      }
    });
  }

  resetForm(form: NgForm) {
    form.reset();
    this.products = { title: '', price: '', category: '', stock: '', overallrating: '' };
    this.student = { studentname: '', class: '', dob: '', gender: '' };
  }
}
