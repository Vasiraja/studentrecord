import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-view',
  standalone: true,
  imports: [MatTableModule, FormsModule, CommonModule],
  templateUrl: './product-view.component.html',
  styleUrl: './product-view.component.css'
})
export class ProductViewComponent implements OnInit {

  editId: any = null;
  backup: any = {};
  filterCategoriesApi: any[] = [];
  productApiColumns: string[] = ['id', 'title', 'price', 'category', 'actions'];
  apiError!:boolean;
  apiErrorMsg:string="";



  constructor(private productservice: ProductsService) { }

  ngOnInit(): void {
    this.productservice.getThirdpartyProducts().subscribe({
      next: (res: any) => {
        this.filterCategoriesApi = res.products || res;
      },
      error: (err) => {
        this.apiError = true;
        this.apiErrorMsg = "Failed to load data";
      }
    });
  }

  edit(product: any) {
    this.editId = product.id;
    this.backup = { ...product };
  }

  cancel() {
    let index = this.filterCategoriesApi.findIndex(p => p.id === this.editId);
    this.filterCategoriesApi[index] = this.backup;
    this.editId = null;
  }

  save(product: any) {
    console.log(product);
    this.editId = null;
  }

  delete(id: any) {
    this.filterCategoriesApi = this.filterCategoriesApi.filter(p => p.id !== id);
    console.log(id);
  }
}