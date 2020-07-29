import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiParseLinks } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ISales } from 'app/shared/model/sales.model';

import { ITEMS_PER_PAGE } from 'app/shared/constants/pagination.constants';
import { SalesService } from './sales.service';
import { SalesDeleteDialogComponent } from './sales-delete-dialog.component';

@Component({
  selector: 'jhi-sales',
  templateUrl: './sales.component.html'
})
export class SalesComponent implements OnInit, OnDestroy {
  sales: ISales[];
  eventSubscriber?: Subscription;
  itemsPerPage: number;
  links: any;
  page: number;
  predicate: string;
  ascending: boolean;

  constructor(
    protected salesService: SalesService,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal,
    protected parseLinks: JhiParseLinks
  ) {
    this.sales = [];
    this.itemsPerPage = ITEMS_PER_PAGE;
    this.page = 0;
    this.links = {
      last: 0,
    };
    this.predicate = 'dateOfSale,id';
    this.ascending = false;
  }

  loadAll(): void {
    this.salesService
      .query({
        page: this.page,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe((res: HttpResponse<ISales[]>) => this.paginateSales(res.body, res.headers));
  }

  reset(): void {
    this.page = 0;
    this.sales = [];
    this.loadAll();
  }

  loadPage(page: number): void {
    this.page = page;
    this.loadAll();
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInSales();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: ISales): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInSales(): void {
    this.eventSubscriber = this.eventManager.subscribe('salesListModification', () => this.reset());
  }

  delete(sales: ISales): void {
    const modalRef = this.modalService.open(SalesDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.sales = sales;
  }

  sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected paginateSales(data: ISales[] | null, headers: HttpHeaders): void {
    const headersLink = headers.get('link');
    this.links = this.parseLinks.parse(headersLink ? headersLink : '');
    if (data) {
      for (let i = 0; i < data.length; i++) {
        this.sales.push(data[i]);
      }
    }
  }
}
