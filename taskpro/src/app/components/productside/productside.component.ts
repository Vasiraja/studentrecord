import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatFormFieldControl, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatCardHeader } from '@angular/material/card';

import { SnackbarService } from '../../services/snackbar.service';
import { ProductsService } from '../../services/products.service';
import { StudentsService } from '../../services/students.service';
import { MatOption, MatOptionModule } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { ConnectionclientService } from '../../services/connectionclient.service';

@Component({
  selector: 'app-productside',
  standalone: true,
  imports: [MatFormField, MatSelect, MatOption, MatButton, MatLabel, FormsModule, CommonModule, MatLabel, MatSelect, MatOption, MatInput, MatCardHeader],

  templateUrl: './productside.component.html',
  styleUrl: './productside.component.css'
})
export class ProductsideComponent implements OnInit {

  product: any = {};
  base64String: any = "";
  categories: any[] = ['Groceries', 'Electronics', 'Gadgets']

  constructor(
    private productServ: StudentsService,
    private productservice: ProductsService,
    private snackbar: SnackbarService, private studentservice: StudentsService,
    private clientconnect: ConnectionclientService
  ) { }


  editingRecordId: string | null = null;
  isEditing = false;
  originalRecord: any = null;
  selectedRecord: any = null;

  ngOnInit(): void {
    this.productServ.productEdit$.subscribe({
      next: (res: any) => {
        if (res) {
          this.product = { ...res };
          this.isEditing = true;
          this.originalRecord = res;
          this.selectedRecord = res;
          this.editingRecordId = res._id;
        } else {
          this.product = {};
        }
      },
      error: (err: any) => console.error(err)
    });
    this.clientconnect.authenticate();
    const productserv = this.clientconnect.getProductClient();

    productserv.on('patched', (updated: any) => {
      console.log("product patch started individual view")

      this.handleRealtimeUpdate(updated);
    })






  }


  onFileSelect(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.product.profilePhoto = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.base64String = reader.result as string;
      this.product.profilePhoto = this.base64String;
    };

    reader.readAsDataURL(file);
  }

  cancelForm() {
    this.productServ.cancelTrigger();
  }

  onSubmit(form: NgForm) {
    if (form.invalid) return;
    console.log(this.product)

    this.productservice.addProduct(this.product).subscribe({
      next: (res: any) => {
        this.product.profilePhoto=res.profilePhoto;
        this.snackbar.openSnackBar(res.title + " added");
        this.cancelForm();
        
      },
      error: (err: any) => console.error(err)
    });


    form.resetForm();
  }

  onUpdate(id: any, form: NgForm) {
    if (form.invalid) return;

    this.productservice.updateProducts(id, this.product).subscribe({
      next: (res: any) => {
        this.snackbar.openSnackBar(res.title + " updated");
        this.cancelForm();
      },
      error: (err: any) => console.error(err)
    });
  }

  confirmDelete(id: any) {
    this.productservice.deleteProducts(id).subscribe({
      next: (res: any) => {
        this.snackbar.openSnackBar(res.title + " deleted");
        this.cancelForm();

      },
      error: (err: any) => console.error(err)
    });
  }
  cancelEdit() {
    this.isEditing = false;
    this.editingRecordId = null;

    this.editingRecordId = '';
  }
  handleRealtimeUpdate(updated: any) {

    const isSameRecord = updated._id === this.editingRecordId;

    if (this.isEditing && isSameRecord) {
      this.snackbar.openSnackBar("Another user updated this record");

      this.product = {
        ...this.product,
        ...updated
      };

      this.cancelEdit();
      this.studentservice.removeAddTrigger();
      return;
    }
    if (this.product && this.product._id === updated._id) {
      this.product = {
        ...this.product,
        ...updated
      };
    }
  }
}