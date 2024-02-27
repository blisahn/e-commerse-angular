import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderHistory } from '../common/order-history';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderHistoryService {
  // we are accessing orders via this url
  private orderUrl = environment.luv2ShopApiUrl + '/orders';

  // injected HttpClient to proccess CRUD operations on REST API
  constructor(private httpClient: HttpClient) { }


  getOrderHistory(theEmail: string): Observable<GetResponseOrderHistory> {
    // creates a url for searchByEmail based on customer email
    const orderHistoryUrl = `${this.orderUrl}/search/findByCustomerEmailOrderByDateCreatedDesc?email=${theEmail}`;

    return this.httpClient.get<GetResponseOrderHistory>(orderHistoryUrl)
  }


}
// helper interface for deal with JSON that exposed in REST API 
interface GetResponseOrderHistory {
  _embedded: {
    orders: OrderHistory[];
  }
}
