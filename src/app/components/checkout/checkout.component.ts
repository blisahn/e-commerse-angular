import { publishFacade } from '@angular/compiler';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { Country } from 'src/app/common/country';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { Luv2ShopFormService } from 'src/app/services/luv2-shop-form.service';
import { Luv2ShopValidators } from 'src/app/validators/luv2-shop-validators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {


  /**
   * for make components read only you can recieve the specified div 
   * as below
   */

  @ViewChild('bilingAddress') bilingAddressDiv!: ElementRef;
  readOnly: boolean = false;


  /**
   * first we are creating a FormGroup instance 
   */
  checkoutFormGroup!: FormGroup;


  // adding fields for review page. 
  totalPrice: number = 0;
  totoalQuantity: number = 0;

  // adding fields for populate dropdown lists
  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  // we have to declare new fields because we create new 
  // rest endpoint , and have to receive them from your service.
  countries: Country[] = [];
  states: State[] = [];

  // and also creating a 2 new array for holding shipping and billing states
  // acording to specified country codes

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  //added for keeping the track of loggedin user's
  // email to prepopulate the form
  storage: Storage = sessionStorage;

  /**
   * 
   * @param formBuilder  for creating the forms
   * @param luv2ShopFormService for keeping the track
   *  of current months and 
   * years(doing it because give valid dates to the forms)
   * @param cartService for keeping the track of latest quantity and price
   * @param checkOutService for POST JSON to the spring boot backend
   * @param router 
   */
  constructor(private formBuilder: FormBuilder,
    private luv2ShopFormService: Luv2ShopFormService,
    private cartService: CartService,
    private checkOutService: CheckoutService,
    private router: Router) {

  }

  /**
   * we are designin our reactive form after component is initialized.
   */
  ngOnInit(): void {

    this.reviewCartDetails();

    // read the user's email addres from the browser
    const theEmail = JSON.parse(this.storage.getItem('userEmail')!);
    /**
     * Validators has been added for customer form,
     * they will trigger when purchase button has been clicked,
     * and also we have to create custom validator because if we pass white spaces 
     * for the firstName and lastName field it passes
     */
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('',
          [Validators.required,
          Validators.minLength(2),
          Luv2ShopValidators.notOnlyWhiteSpaces]),
        lastName: new FormControl('',
          [Validators.required,
          Validators.minLength(2),
          Luv2ShopValidators.notOnlyWhiteSpaces]),
        email: new FormControl(theEmail,
          [Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9._]+\\.[a-z]{2,4}$')])
      }),
      shippingAddress: this.formBuilder.group({
        country: new FormControl('',
          [Validators.required]),
        street: new FormControl('',
          [Validators.required, Validators.minLength(2),
          Luv2ShopValidators.notOnlyWhiteSpaces]),
        city: new FormControl('',
          [Validators.required, Validators.minLength(2),
          Luv2ShopValidators.notOnlyWhiteSpaces]),
        state: new FormControl('',
          [Validators.required]),
        zipCode: new FormControl('',
          [Validators.required, Validators.minLength(2),
          Luv2ShopValidators.notOnlyWhiteSpaces])
      }),
      billingAddress: this.formBuilder.group({
        country: new FormControl('',
          [Validators.required]),
        street: new FormControl('',
          [Validators.required, Validators.minLength(2),
          Luv2ShopValidators.notOnlyWhiteSpaces]),
        city: new FormControl('',
          [Validators.required, Validators.minLength(2),
          Luv2ShopValidators.notOnlyWhiteSpaces]),
        state: new FormControl('',
          [Validators.required]),
        zipCode: new FormControl('',
          [Validators.required, Validators.minLength(2),
          Luv2ShopValidators.notOnlyWhiteSpaces])
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl('',
          [Validators.required]),
        nameOnCard: new FormControl('',
          [Validators.required, Validators.minLength(2),
          Luv2ShopValidators.notOnlyWhiteSpaces]),
        cardNumber: new FormControl('',
          [Validators.required, Validators.pattern('[0-9]{16}')]),
        securityCode: new FormControl('',
          [Validators.required, Validators.pattern('[0-9]{3}')]),
        expirationMonth: [''],
        expirationYear: ['']
      })
    });



    // populating the credit card months
    // months are 0 based so for turning them into the real dates add one
    const startMonth: number = new Date().getMonth() + 1;
    console.log(`startMonth: ${startMonth}`);
    // get the credit card months, send data to the all of the subjects because of subscribe()
    this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log(`Retrieved credit card months: ${JSON.stringify(data)}`);
        this.creditCardMonths = data;
      }
    )

    // get the credit cardyears and send data to the all of the subjects because of subscribe()
    this.luv2ShopFormService.getCreditCardYears().subscribe(
      data => {
        console.log(`Retrieved credit card years: ${JSON.stringify(data)}`);
        this.creditCardYears = data;

      }
    )

    // populate countries[] 
    this.luv2ShopFormService.getCountries().subscribe(
      data => {
        console.log(`Retrieved countries: ${JSON.stringify(data)}`);
        this.countries = data;
      }
    );

  }

  /**
   * declaring a new mothod for keep track of lates quantity
   * and price 
   */
  reviewCartDetails() {
    // assignt this.totalQuantity and this.totalPrice
    // to the latest price and quantity
    this.cartService.totalQuantity.subscribe(
      totalQuantity => this.totoalQuantity = totalQuantity
    );

    this.cartService.totalPrice.subscribe(
      totalPrice => this.totalPrice = totalPrice
    );
  }

  /**
   * we are declaring a method for handle submit event
   */
  onSubmit() {
    console.log("Handling the submit button");
    // after we click the submit button  below code will mark all of the fields as a touched,
    // and this will let us to show error messagges
    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

    // set up order
    let order = new Order;
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totoalQuantity;

    // get cart items
    const cartItems = this.cartService.cartItems;

    // create orderItems from cartItems
    let orderItems: OrderItem[] = cartItems.map(tempCartItem => new OrderItem(tempCartItem))

    // set up purchase
    let purchase = new Purchase();

    // populate pruchase - customer
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;

    // populate purchase - shippingAddress
    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingAddressState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    const shippingAddressCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
    purchase.shippingAddress.state = shippingAddressState.name;
    purchase.shippingAddress.country = shippingAddressCountry.name;

    // populate purchase - billingAddress
    purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
    const billingAddressState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
    const billingAddressCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));
    purchase.billingAddress.state = billingAddressState.name;
    purchase.billingAddress.country = billingAddressCountry.name;

    // populate purchase - order and orderItems
    purchase.order = order;
    purchase.orderItems = orderItems;

    // call REST API via the CheckoutService
    this.checkOutService.placeOrder(purchase).subscribe({
      next: response => {
        alert(`Your order has been received.\nOrder tracking number: ${response.orderTrackingNumber}`);

        // reset cart
        this.resetCart();
      },
      error: err => {
        alert(`Therewas an error: ${err.messagge}`);
      }
    }
    );

  }
  resetCart() {
    // reset cart data
    this.cartService.cartItems = [];// make it an empty array
    this.cartService.totalPrice.next(0); // this and below method will send 0 to all of the subscribers
    this.cartService.totalQuantity.next(0);
    this.cartService.storage.removeItem('cartItems');

    // reset the form
    this.checkoutFormGroup.reset();

    // navigate back to the product page
    this.router.navigateByUrl("/products");

  }

  // we need to have additional getter methods, because when purchase button(onSubmit method ) has been clicked
  // we are gonna check our values for that
  get firstName() { return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName() { return this.checkoutFormGroup.get('customer.lastName'); }
  get email() { return this.checkoutFormGroup.get('customer.email'); }

  get shippingAddressStreet() { return this.checkoutFormGroup.get('shippingAddress.street'); }
  get shippingAddressCity() { return this.checkoutFormGroup.get('shippingAddress.city'); }
  get shippingAddressState() { return this.checkoutFormGroup.get('shippingAddress.state'); }
  get shippingAddressZipCode() { return this.checkoutFormGroup.get('shippingAddress.zipCode'); }
  get shippingAddressCountry() { return this.checkoutFormGroup.get('shippingAddress.country'); }

  get billingAddressStreet() { return this.checkoutFormGroup.get('billingAddress.street'); }
  get billingAddressCity() { return this.checkoutFormGroup.get('billingAddress.city'); }
  get billingAddressState() { return this.checkoutFormGroup.get('billingAddress.state'); }
  get billingAddressZipCode() { return this.checkoutFormGroup.get('billingAddress.zipCode'); }
  get billingAddressCountry() { return this.checkoutFormGroup.get('billingAddress.country'); }

  get cardType() { return this.checkoutFormGroup.get('creditCard.cardType') }
  get nameOnCard() { return this.checkoutFormGroup.get('creditCard.nameOnCard') }
  get cardNumber() { return this.checkoutFormGroup.get('creditCard.cardNumber') }
  get securityCode() { return this.checkoutFormGroup.get('creditCard.securityCode') }
  get expirationMonth() { return this.checkoutFormGroup.get('creditCard.expirationMonth') }
  get expirationYear() { return this.checkoutFormGroup.get('creditCard.expirationYear') }


  copyShippingAddressToBillingAddress(event: any) {
    /**
     * for make specified elemenmts read only first you have to receive them 
     */
    const inputElements = this.bilingAddressDiv.nativeElement.querySelectorAll('input');
    const selectElements = this.bilingAddressDiv.nativeElement.querySelectorAll('select');
    if (event.target.checked) {
      this.checkoutFormGroup.controls['billingAddress']
        .setValue(this.checkoutFormGroup.controls['shippingAddress'].value);
      // bug fix for states

      this.billingAddressStates = this.shippingAddressStates;

      /**
       * as you can see you can edit them.
       */
      this.readOnly = true;
      inputElements.forEach((input: any) => {
        input.readOnly = true;
      });

      selectElements.forEach((select: any) => {
        select.disabled = true;
      });
    } else {
      this.checkoutFormGroup.controls['billingAddress'].reset();

      // bug fix for states
      this.billingAddressStates = [];
      inputElements.forEach((input: any) => {
        input.readOnly = false;
      });

      selectElements.forEach((select: any) => {
        select.disabled = false;
      });
    }
  }

  handleMonthsAndYears() {
    // if we make and difference on the year <select> then we will call this method
    /**
     * this method firstly take datas from your form 
     * and if specified stiuation happens (if the current year is equal to selected year we will
     * start our months from existing month +1 (because of number base difference) to valid dependent fields) it will do 
     * something.
     */

    // receive form
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

    // receive current year
    const currentYear: number = new Date().getFullYear();

    // receive selected year
    const selectedYear: number = Number(creditCardFormGroup?.value.expirationYear);

    let startMonth: number;
    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1
    } else {
      startMonth = 1;
    }

    this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log(`Retrieved credit card months: ${JSON.stringify(data)}`);
        this.creditCardMonths = data;
      }
    );
  }

  getStates(formGroupName: string) {
    // receive form group name and for this input receive
    // countryCode and countryName from the object
    const formGroup = this.checkoutFormGroup.get(formGroupName);

    const countryCode = formGroup?.value.country.code;
    const countryName = formGroup?.value.country.name;

    // just for debuggin purposes
    console.log(`${formGroupName} country code: ${countryCode}`);
    console.log(`${formGroupName} country name: ${countryName}`);



    /**
     * if countryCode === 'shippingAddress' set shippingAddresStates to the data 
     * that comes from rest api
     * else set appropirate data to the billingAddressStates 
     */
    this.luv2ShopFormService.getStates(countryCode).subscribe(
      data => {
        if (formGroupName === 'shippingAddress') {
          this.shippingAddressStates = data;
        } else {
          this.billingAddressStates = data;
        }
        // select the firstElement of form group to default state
        formGroup?.get('state')?.setValue(data[0]);
      }
    )

  }
}
