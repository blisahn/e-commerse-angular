import { Address } from "./address";
import { Customer } from "./customer";
import { Order } from "./order";
import { OrderItem } from "./order-item";
// Purchase is the wrapper class for us to send data  
export class Purchase {
    customer!: Customer;
    shippingAddress!: Address;
    billingAddress!: Address;
    order!: Order;
    orderItems!: OrderItem[];
}
