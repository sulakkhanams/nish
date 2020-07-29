import {Injectable} from "@angular/core";
import {IInventory, Inventory} from "app/shared/model/inventory.model";
import {ISalesItems, SalesItems} from "app/shared/model/sales-items.model";
import {ICustomerDetails} from "app/shared/model/customer-details.model";

@Injectable({providedIn:"root"})
export class SalesData{

  reviewItem?:IInventory;
  cart:ISalesItems[] = [];
  customer?:ICustomerDetails;


  constructor() {
    this.reviewItem = new Inventory();
  }

  public add(item: IInventory): void {
    this.reviewItem = item;
  }

  public removeFromCart(item: ISalesItems): void {
    const index = this.cart.indexOf(item);
    this.cart.splice(index, 1);
  }

  destroy():void{
    delete this.cart;
    delete this.customer;
    delete this.reviewItem;
  }

  getCustomer():any{
    return this.customer;
  }

  getReviewItem(): any {
    if (this.reviewItem != null) {
      return this.reviewItem;
    }
    return new Inventory();
  }

  getCart(): any {
    return this.cart;
  }

  public addToCart(item: SalesItems): void {
    this.check(item);
    this.cart.push(item);
  }

  public check(item: SalesItems): void {
    for (const cart of this.cart) {
      if (cart.itemCode?.itemCode === item.itemCode?.itemCode) {
        this.removeFromCart(cart);
        break;
      }
    }
  }
}
