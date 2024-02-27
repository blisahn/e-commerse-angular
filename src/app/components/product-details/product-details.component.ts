import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {


  /**
   * in our ProductDetailComponent class first of all we should inject ProductService(to have acces to rest data)
   * and Activated route( to acces request datas)
   */
  product!: Product;
  
  

  constructor(private productService: ProductService,
              private cartService: CartService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getDetailView();
  }


  /**
   * so with thie method we are recieveing a id from our route and 
   * we are passing that id to the another method in productService.getProduct(something:number); method 
   * then we are passing it to the ngOnInit method because it will act like a @PostConstruct 
   */
  getDetailView(): void {
    const theProductId: number = +this.route.snapshot.paramMap.get('id')!;

    this.productService.getProduct(theProductId).subscribe(
      data => {
        this.product = data;
      }
    )
  }

  addtoCart() {
    /**
     * we are calling the cartService.addToCart(this.product) method to use original 
     * addToCart method from cartService.
     */
    console.log(`Adding to cart: ${this.product.name}, ${this.product.unitPrice}`);
    /** we are creating it right now. */
    const theCartItem = new CartItem(this.product);
    this.cartService.addToCart(theCartItem);
  }


}
