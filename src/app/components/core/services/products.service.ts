import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}

  getProductsByCategory(categoryId: string): Observable<any> {
    return this.http.get<any>(`${environment.getProductsUrl}/${categoryId}`);
  }
  
}
