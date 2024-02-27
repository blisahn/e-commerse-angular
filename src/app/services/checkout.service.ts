import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Purchase } from '../common/purchase';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
// check out service will lets us to make a connection 
// to spring boot backend
export class CheckoutService {



  private purchaseUrl = environment.luv2ShopApiUrl + '/checkout/purchase';

  // we are injecting HttpClient to establish a connection to rest apı
  constructor(private httpClient: HttpClient) {
  }


  /**
   * 
   * @param purchase 
   * @returns a JSON body that hold @param purchase
   * and post that purchase to the rest api to handle it.
  */
  placeOrder(purchase: Purchase): Observable<any> {

    return this.httpClient.post<Purchase>(this.purchaseUrl, purchase);
  }


}
