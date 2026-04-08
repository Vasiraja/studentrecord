import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private http: HttpClient) { }
  thirdpartyApiUrl = "https://dummyjson.com/products/";
  apiUrl = "http://localhost:3030/products"


  getThirdpartyProducts(): Observable<any> {

    return this.http.get(this.thirdpartyApiUrl)
  }
  getProducts(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}
