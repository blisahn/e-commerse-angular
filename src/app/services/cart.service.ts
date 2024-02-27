import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { BehaviorSubject, Subject } from 'rxjs';
/**
 * creating a new service for use advantage of cartService
 */
@Injectable({
  providedIn: 'root'
})
export class CartService {

  // empty array for holding the items that passed.
  cartItems: CartItem[] = [];

  // reference to web browser's session storage
  // we can use localStorage if we want to keep the data 
  // even if the browser is closed
  storage: Storage = sessionStorage;
  // storage: Storage = localStorage;
  // total price, it is a Subject so it will be effect all of the types that use 
  // .subscribe() method () you can see it from the cart-status.component.ts
  // we are changing type Subject to BehaviorSubject 
  // because BehaviorSubject keep the latest value of field in a buffer
  // so because of that we are able to access latest quantity, and price from 
  // all over the subscribers
  totalPrice: Subject<number> = new BehaviorSubject<number>(0);

  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);


  constructor() {
    // read data from storage
    let data = JSON.parse(this.storage.getItem('cartItems')!);
    if (data != null) {
      this.cartItems = data;
      // compute totals based on the data that is read from storage
      this.computeCartTotals();
    }
  }

  persistCartItems() {
    // get cartItems field and assign in to the cartItems value in session storage
    // key-value pair
    this.storage.setItem('cartItems', JSON.stringify(this.cartItems));
  }

  addToCart(theCartItem: CartItem) {
    // check if we already have the item in our cart
    let alreadyExistsInCart: boolean = false;
    //@ts-ignore
    let existingCartItem: CartItem = undefined;

    if (this.cartItems.length > 0) {
      // find the item in the cart based on item id

      // @ts-ignore
      existingCartItem = this.cartItems.find(tempCartItem => tempCartItem.id === theCartItem.id);

      // check if we found it
      alreadyExistsInCart = (existingCartItem != undefined);
    }

    /** if the item already exists we are incrementing the quantity */
    if (alreadyExistsInCart) {
      // increment the quantity of item
      existingCartItem.quantity++;
    } else {
      // if it is not exist it will add new cartItem to the array cartItems[] 
      this.cartItems.push(theCartItem);
    }
    // compute the cart total price and total quantity
    this.computeCartTotals();
  }

  computeCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;
    // computes the total quantity and totalPrice and send it to the all subscribers
    for (let currentCartItem of this.cartItems) {
      totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;
    }

    // publis the new values ... al subscribers will recieve the new data
    // these method will send updated datas to all of the subscribed fields.
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    // log cart data just for debugging purposes
    this.logCartData(totalPriceValue, totalQuantityValue);

    // when this method has been called the persistCartItems() method will update 
    // the local storage
    this.persistCartItems();
  }


  logCartData(totalPriceValue: number, totalQuantityValue: number) {

    console.log('Contens of the cart');

    for (let tempCartItem of this.cartItems) {
      const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;
      console.log(`name: ${tempCartItem.name}, quantity= ${tempCartItem.quantity},
       unitPrice= ${tempCartItem.unitPrice} subTotalPrice= ${subTotalPrice}`);
    }

    console.log(`totalPrice: ${totalPriceValue.toFixed(2)}, totalQuantity: ${totalQuantityValue}`);
    console.log('---'.repeat(15));

  }

  decrementQuantity(theCartItem: CartItem) {
    // decrease the quantity
    // if it is zero use a helper method to remove it from the list
    theCartItem.quantity--;
    if (theCartItem.quantity === 0) {
      this.remove(theCartItem);
    } else {
      this.computeCartTotals();
    }
  }
  remove(theCartItem: CartItem) {
    // get the index of tharCartItem in the array
    const itemIndex = this.cartItems.findIndex(
      tempCartItem => tempCartItem.id == theCartItem.id
    );
    // if wound, remove the item from the array at given index
    if (itemIndex > -1) {
      this.cartItems.splice(itemIndex, 1);
      this.computeCartTotals();
    }
  }
}


