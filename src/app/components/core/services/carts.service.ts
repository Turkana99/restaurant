import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, skip } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartIdSource = new BehaviorSubject<any>(null);
  cartId$ = this.cartIdSource.asObservable().pipe(skip(1));

  private orderStateSource = new BehaviorSubject<any>(null);
  orderState$ = this.orderStateSource.asObservable().pipe(skip(1));

  // Set the cartId
  setCartId(cartId: string | number) {
    sessionStorage.setItem('cartId', cartId.toString());
    this.cartIdSource.next(cartId);
  }

  setOrderState(orderState: string) {
    sessionStorage.setItem('orderState', orderState);
    this.orderStateSource.next(orderState);
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
  deleteCart(id: any) {
    return this.http.delete<any>(`${environment.getCartsUrl}/${id}`, {
      observe: 'response',
    });
  }
}
