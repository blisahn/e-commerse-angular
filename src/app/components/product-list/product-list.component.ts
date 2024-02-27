import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {



  products : Product[] = [];
  currentCategoryId: number = 1
  previousCategoryId: number = 1;
  searchMode: boolean = false;
  currentCategoryName: string = "";

  // new properties for pagination
  thePageNumber: number = 1;
  thePageSize: number = 5;
  theTotalElements: number = 0;

  previousKeyword: string = "";

  /** we are assigning
   * needed services to accecs their methods.
   */
  constructor(private productService: ProductService,
    private cartService: CartService,
    private route: ActivatedRoute) {

  }
  // updating thePageSize, thePageNumber and 
  // calling listProducts(); method to make a page refresh
  updatePageSize(pageSize: string): void {
    this.thePageSize = +pageSize;
    this.thePageNumber = 1;
    this.listProducts();
  }



  // this method will call after the build complete,
  // and at the moment it will use routers snapshot and call a listProducts() method.            
  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts() {
    /**
     * so this code is from search.component.ts class
     * this.router.navigateByUrl(`/search/${value}`); 
     * and because of this line we are sending a value data to the router 
     * and belowed code we are checking if we sent any keyword to data
     * and if it  is true we gonna create another method to recieve products 
     * according to this keyword.
     */
    this.searchMode = this.route.snapshot.paramMap.has('keyword');
    if (this.searchMode) {
      this.handleSearchProducts();
    } else {
      this.handleListProducts();
    }
  }

  handleSearchProducts() {
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword')!;
    /**
     * if we have a different keyword than the previous 
     * then set thePageNumber to 1
     */

    if (this.previousKeyword != theKeyword) {
      this.thePageNumber = 1;
    }

    this.previousKeyword = theKeyword;

    console.log(`keyword=${theKeyword},thePageNumber=${this.thePageNumber}`);


    // need to search for products using 'theKeyword'
    this.productService.searchProductsPaginate(this.thePageNumber - 1,
      this.thePageSize,
      theKeyword).subscribe(data => {
        this.products = data._embedded.products;
        this.thePageNumber = data.page.number + 1;
        this.thePageSize = data.page.size;
        this.theTotalElements = data.page.totalElements;
      });

    // and assign the returned data to the products array to show them on page

  }

  handleListProducts() {

    // this method will check that whether the router contains 'id' parameter
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');
    if (hasCategoryId) {
      // if the route contains 'id' we will set currentCategoryId to 'id' parameters vallue
      // but at the initialization +this.route.snapshot.paramMap.get('id')! this method will turn
      // string so we are adding + to convert it into a number, ! opertor tells compiler 
      // this is not a nullable object.
      this.currentCategoryName = this.route.snapshot.paramMap.get('categoryName')!;
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
    } else {
      // if it doesn't contain 'id' paramter set default value = 1
      this.currentCategoryId = 1;
      this.currentCategoryName = 'Books'
    }

    /**
     *  checking if we have a different category than previous
     *  Note:  Angular will reuse a component if it is currentl being viewed
     */

    // if we have different category id than previous
    // then set thePageNumber back to 1 basically 
    // if we made any change on category id it wil sett thePage number to 1 

    if (this.previousCategoryId != this.currentCategoryId) {
      this.thePageNumber = 1
    }

    this.previousCategoryId = this.currentCategoryId;
    console.log(`currentCategoryId = ${this.currentCategoryId}, thePageNumber = ${this.thePageNumber}`);


    // now get the products for given category id
    this.productService.getProductListPaginate(this.thePageNumber - 1,
      this.thePageSize,
      this.currentCategoryId)
      .subscribe(
        data => {
          this.products = data._embedded.products;
          this.thePageNumber = data.page.number + 1;
          this.thePageSize = data.page.size;
          this.theTotalElements = data.page.totalElements;
        }
      );
    /**
     * and we are assigning our angular fields to the rest filds tham comes from REST API
     * */
  }

    /**
   * this method will add products to the Cart from product-list-grid.html
   * this method will create new Cart Item and send it to the cartservic addToCart method 
   */
    addtoCart(theProduct: Product) {
      console.log(`Adding to cart: ${theProduct.name}, ${theProduct.unitPrice}`);
  
      const theCartItem = new CartItem(theProduct);
  
      this.cartService.addToCart(theCartItem);
  
    }

  private processResult() {
    return (data: any) => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.thePageNumber + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    }
  }

}
