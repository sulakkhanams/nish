import {Component, OnInit} from '@angular/core';
import {HttpResponse} from "@angular/common/http";
import {IInventory} from "app/shared/model/inventory.model";
import {InventoryService} from "app/Pages/Inventory/inventory/inventory.service";
import {BuyPopupComponent} from "app/Pages/Purchase/buy-popup/buy-popup.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {SalesData} from "app/Pages/Sales/salesData";
import {SalesPopupComponent} from "app/Pages/Sales/sales-popup/sales-popup.component";

@Component({
  selector: 'jhi-sales-cart',
  templateUrl: './sales-cart.component.html',
  styleUrls: [
    'sales-cart.component.scss'
  ]
})
export class SalesCartComponent implements OnInit {

  itemName: string;
  itemCode:string;
  searchItems: IInventory[] = [];

  constructor(private inventoryService:InventoryService,
              private modalService:NgbModal,
              public salesData:SalesData) {
    this.itemName = '';
    this.itemCode = '';
  }

  ngOnInit(): void {
    // this.search();
  }

  search(): void {
    if ((this.itemName === '' || this.itemName.length === 0) && (this.itemCode === '' || this.itemCode.length === 0)) {
      this.inventoryService.query().subscribe((res: HttpResponse<IInventory[]>) => (this.searchItems = res.body || []));
    } else if (this.itemName === '' || this.itemName.length === 0) {
      this.inventoryService.findAllByCode(this.itemCode).subscribe((res: HttpResponse<IInventory[]>) => (this.searchItems = res.body || []));
    } else if (this.itemCode === '' || this.itemCode.length === 0) {
      this.inventoryService.findAllByName(this.itemName).subscribe((res: HttpResponse<IInventory[]>) => (this.searchItems = res.body || []));
    } else {
      this.inventoryService.findAllByCodeAndName(this.itemCode, this.itemName).subscribe((res: HttpResponse<IInventory[]>) => (this.searchItems = res.body || []));
    }
  }

  addToCart(item: IInventory): void {
    const modalRef = this.modalService.open(SalesPopupComponent);
    this.salesData.add(item);
  }
}