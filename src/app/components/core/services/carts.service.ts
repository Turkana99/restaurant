import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartIdSource = new BehaviorSubject<string | null>(null);
  cartId$ = this.cartIdSource.asObservable();

  // Set the cartId
  setCartId(cartId: string) {
    this.cartIdSource.next(cartId);
  }

  // Get the current cartId
  getCartId() {
    return this.cartIdSource.value;
  }
  constructor(private http: HttpClient) {}
  getCarts(): Observable<any> {
    return this.http.get<any>(environment.getCartsUrl);
  }

  addCart(request: any): Observable<any> {
    return this.http.post<any>(environment.getCartsUrl, request);
  }

  editCart(request: any): Observable<any> {
    return this.http.put<any>(environment.getCartsUrl, request);
  }
}
