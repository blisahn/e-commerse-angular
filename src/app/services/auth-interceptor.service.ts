import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { from, lastValueFrom, Observable } from 'rxjs';
import { request } from 'http';
import { OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
// we are creating an InterceptorService for, access order history endpoint
// for that we have to send a JWT access token to our spring boot backend
export class AuthInterceptorService implements HttpInterceptor {

  constructor(@Inject(OKTA_AUTH) private oktaAuth: OktaAuth) { }




  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.handleAccess(request, next));
  }



  private async handleAccess(request: HttpRequest<any>, next: HttpHandler): Promise<HttpEvent<any>> {

    // Only add an access token for secured endpoints.
    const theEndpoint = environment.luv2ShopApiUrl +'/orders';
    const securedEndpoints = [theEndpoint];

    // if the current urlWithParams includes any of the securedEndpoints 
    if (securedEndpoints.some(url => request.urlWithParams.includes(url))) {

      // get access token
      const accessToken = this.oktaAuth.getAccessToken();

      // clone a request and add a new header for jwt with access token
      // we are cloning and then updating it because 'request' is immutable
      request = request.clone({
        setHeaders: {
          Authorization: 'Bearer ' + accessToken
        }
      });
    }

    // if there is another interseptor in the chain, handle by them
    // if there is not make another request that contains request body.
    return await lastValueFrom(next.handle(request));
  }
}
