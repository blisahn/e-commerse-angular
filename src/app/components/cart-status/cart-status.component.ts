import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-status',
  templateUrl: './cart-status.component.html',
  styleUrls: ['./cart-status.component.css']
})
export class CartStatusComponent implements OnInit {
  /**
   * we are assigning some initial value for the starting of the app
   */
  totalPrice: number = 0.00;
  totalQuantity: number = 0;



  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.updateCartStatus();
  }


  updateCartStatus() {
    /**
     * subscribe to the cart totalPrice, this methods will collect information from 
     */
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );


    // subscribe to the to the cart totalQuantity
    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );
  }

}
