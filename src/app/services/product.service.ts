import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import { map } from 'rxjs/operators';
import { ProductCategory } from '../common/product-category';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  // will come back to this part  update spring boot app.



  private baseUrl = environment.luv2ShopApiUrl + '/products';

  private categoryUrl = environment.luv2ShopApiUrl + '/product-category';

  constructor(private httpClient: HttpClient) { }

  // modify below method to accept nubmer as a method parameter
  getProductList(theCategoryId: number): Observable<Product[]> {
    // need to build URL based on catedgory id ..
    // will come back to this part  update spring boot app.
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;

    return this.getProducts(searchUrl);
  }
  // we are creating a new method to handle pagination for search by keyword functionality
  // ang we are recieving our data from GetResponseProduct interface
  searchProductsPaginate(thePage: number,
    thePageSize: number,
    theKeyword: string): Observable<GetResponseProducts> {

    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}&page=${thePage}&size=${thePageSize}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }
  searchProduct(theKeyword: string): Observable<Product[]> {

    // we are modifying our search url to get the data that we sent
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`;
    // we are adding it for debbuging
    console.log(`searchUrl= ${searchUrl}`);
    // we are recieveing the data from our rest services.
    return this.getProducts(searchUrl);

  }

  /**
   * we are declaring new method to use this as a default productListPage for having
   * pagination info and another main page, and this methods show us the page for 
   * desired catehory because of theCategoryId
   *  */

  getProductListPaginate(thePage: number,
    thePageSize: number,
    theCategoryId: number): Observable<GetResponseProducts> {
    // we are creating a new Url for recieveing information from there
    // and also recieving the pagination info 
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`
      + `&page=${thePage}&size=${thePageSize}`;

    console.log(`Getting products from ${searchUrl}`);

    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  /**
   * this method basically uses rest client to recieve the Product from  the JSON 
   *  that exposed via REST API 
   */
  getProduct(theProductId: number): Observable<Product> {
    // we are creating a new Url for recieveing information from there
    const productUrl = `${this.baseUrl}/${theProductId}`;
    return this.httpClient.get<Product>(productUrl);
  }


  /**
   *  we are declaring and expecting to recieve a Observabla<ProductCategory[]> 
   *  from this method and we are using httpClient.get<GetResponseProductCategory> to recieve
   *  response from our REST API and we are using a helper interface to recieve information from 
   *  _embedded bod of the response of JSON
   */
  getProductCategories(): Observable<ProductCategory[]> {
    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    )
  }

  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(searchUrl)
      .pipe(map((response) => response._embedded.products));
  }

}
interface GetResponseProducts {
  _embedded: {
    products: Product[];
  },
  page: {
    size: number;
    totalElements: number,
    totalPages: number,
    number: number
  };

};

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  };
}
