import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {PurchaseItems} from "app/shared/model/purchase-items.model";
import {SalesData} from "app/Pages/Sales/salesData";
import {SalesItems} from "app/shared/model/sales-items.model";

@Component({
  selector: 'jhi-sales-popup',
  templateUrl: './sales-popup.component.html',
  styleUrls: ['./sales-popup.component.scss']
})
export class SalesPopupComponent implements OnInit {
  selectedItem: SalesItems = new SalesItems();
  total: number;
  unitPrice: number;
  units: number;

  message: string;

  constructor(public activeModal: NgbActiveModal, public salesData: SalesData) {
    this.total = 0;
    this.units = 0;
    this.unitPrice = this.salesData.getReviewItem().sellingPrice;
    this.message = "";

  }

  ngOnInit(): void {
    this.unitPrice = this.salesData.getReviewItem().sellingPrice;
  }

  calculateTotal(): void {
    this.total = this.units * this.unitPrice;
  }

  addToCart(): void {
    this.selectedItem.quantity = this.units;
    this.selectedItem.total = this.total;
    this.selectedItem.itemCode = this.salesData.reviewItem;
    this.selectedItem.unitPrice = this.unitPrice;
    if (this.checkZeroQuantity()) {
      this.salesData.addToCart(this.selectedItem);
      this.activeModal.close();
    }
  }

  checkZeroQuantity(): boolean {
    if (this.selectedItem.quantity === 0) {
      this.message = "quantity cannot be 0";
      return false;
    }
    return true;
  }

}
