import {Component, OnInit} from '@angular/core';
import {ISalesItems, SalesItems} from "app/shared/model/sales-items.model";
import {ISales, Sales} from "app/shared/model/sales.model";
import {SalesData} from "app/Pages/Sales/salesData";
import {CustomerDetails, ICustomerDetails} from "app/shared/model/customer-details.model";
import {SalesUpdateComponent} from "app/Pages/Sales/sales-details/sales-update.component";
import {SalesService} from "app/Pages/Sales/sales-details/sales.service";
import {SalesItemsUpdateComponent} from "app/entities/sales-items/sales-items-update.component";
import {SalesItemsService} from "app/entities/sales-items/sales-items.service";
import {CustomerDetailsService} from "app/Pages/Sales/customer-details/customer-details.service";
import {CustomerDetailsComponent} from "app/Pages/Sales/customer-details/customer-details.component";
import {CustomerDetailsUpdateComponent} from "app/Pages/Sales/customer-details/customer-details-update.component";

@Component({
  selector: 'jhi-sales-checkout',
  templateUrl: './sales-checkout.component.html',
  styleUrls: [
    'sales-checkout.component.scss'
  ]
})
export class SalesCheckoutComponent implements OnInit {

  salesCart:ISalesItems[];
  sale:ISales;
  total:number;
  customer:ICustomerDetails;
  constructor(public salesData:SalesData,
              protected salesUpdateComponent:SalesUpdateComponent,
              protected salesService:SalesService,
              protected salesItemsUpdateComponent:SalesItemsUpdateComponent,
              protected salesItemsService:SalesItemsService
              ) {
    this.total =this.calculateTotal();
    this.salesCart = this.getItems();
    this.sale = new Sales();
    this.customer = this.salesData.getCustomer();
  }

  ngOnInit(): void {
  }

  updateDatabase():void{
    this.sale = this.createSale();
    this.salesUpdateComponent.subscribeToSaveResponse(this.salesService.create(this.sale));
    for (const item of this.getItems()) {
      item.salesCode = this.sale;
      this.salesItemsUpdateComponent.subscribeToSaveResponse(this.salesItemsService.create(item));
    }

    this.salesData.destroy();
    this.destroy();

  }

  destroy():void{
    delete this.total;
    delete this.salesCart;
    delete this.sale;
    delete this.customer;
  }

  calculateTotal(): number {
    this.total = 0;
    for (const item of this.salesData.getCart()) {
      this.total = this.total + item.total;
    }
    return this.total;
  }

  getItems():ISalesItems[]{
    return this.salesData.cart;
  }

  private createSale(): ISales {
    return {
      ...new Sales(),
      total: this.total,
      serviceCharges: 0,
      dateOfSale: undefined,
      customerID: this.salesData.getCustomer(),
      items:this.getItems(),
    };
  }

  getName():any{
    this.customer.customerName;
  }
}
