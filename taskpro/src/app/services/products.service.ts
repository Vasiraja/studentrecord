import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private http: HttpClient) { }
  thirdpartyApiUrl = "https://dummyjson.com/products/";
  apiUrl = "http://localhost:3030/products";

  productValue$ = new BehaviorSubject<any>(null);
  productEditStatus$ = new BehaviorSubject<boolean>(false);



  getThirdpartyProducts(): Observable<any> {

    return this.http.get(this.thirdpartyApiUrl)
  }
  getProducts(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
  addProduct(productdata: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, productdata)
  }
  updateProducts(id: any, data: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}`, data)
  }
  deleteProducts(id: any): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`)
  }
  sendProducts(data: any) {
    let productsBoolean = this.productEditStatus$.value;
    this.productEditStatus$.next(!productsBoolean);
    productsBoolean = this.productEditStatus$.value;

    if (productsBoolean) {
      this.productValue$.next(data);


    }

  }
  bulkCreate(data: any[]) {
    return this.http.post(`${this.apiUrl}`, data);
  }
}
