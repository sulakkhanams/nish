import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'jhi-sales-menu',
  templateUrl: './sales-menu.component.html',
  styleUrls: [
    'sales-menu.component.scss'
  ]
})
export class SalesMenuComponent implements OnInit {

  message: string;

  constructor() {
    this.message = 'SalesMenuComponent message';
  }

  ngOnInit(): void {
  }

}
