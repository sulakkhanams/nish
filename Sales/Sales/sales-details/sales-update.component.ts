import {Component, Injectable, OnInit} from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ISales, Sales } from 'app/shared/model/sales.model';
import { SalesService } from './sales.service';
import { ICustomerDetails } from 'app/shared/model/customer-details.model';
import { CustomerDetailsService } from 'app/Pages/Sales/customer-details/customer-details.service';
@Injectable({providedIn:"root"})
@Component({
  selector: 'jhi-sales-update',
  templateUrl: './sales-update.component.html',
})
export class SalesUpdateComponent implements OnInit {
  isSaving = false;
  customerids: ICustomerDetails[] = [];
  dateOfSaleDp: any;

  editForm = this.fb.group({
    id: [],
    total: [],
    serviceCharges: [],
    dateOfSale: [],
    customerID: [],
  });

  constructor(
    protected salesService: SalesService,
    protected customerDetailsService: CustomerDetailsService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ sales }) => {
      this.updateForm(sales);

      this.customerDetailsService
        .query({ filter: 'sales-is-null' })
        .pipe(
          map((res: HttpResponse<ICustomerDetails[]>) => {
            return res.body || [];
          })
        )
        .subscribe((resBody: ICustomerDetails[]) => {
          if (!sales.customerID || !sales.customerID.id) {
            this.customerids = resBody;
          } else {
            this.customerDetailsService
              .find(sales.customerID.id)
              .pipe(
                map((subRes: HttpResponse<ICustomerDetails>) => {
                  return subRes.body ? [subRes.body].concat(resBody) : resBody;
                })
              )
              .subscribe((concatRes: ICustomerDetails[]) => (this.customerids = concatRes));
          }
        });
    });
  }

  updateForm(sales: ISales): void {
    this.editForm.patchValue({
      id: sales.id,
      total: sales.total,
      serviceCharges: sales.serviceCharges,
      dateOfSale: sales.dateOfSale,
      customerID: sales.customerID,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const sales = this.createFromForm();
    if (sales.id !== undefined) {
      this.subscribeToSaveResponse(this.salesService.update(sales));
    } else {
      this.subscribeToSaveResponse(this.salesService.create(sales));
    }
  }

  private createFromForm(): ISales {
    return {
      ...new Sales(),
      id: this.editForm.get(['id'])!.value,
      total: this.editForm.get(['total'])!.value,
      serviceCharges: this.editForm.get(['serviceCharges'])!.value,
      dateOfSale: this.editForm.get(['dateOfSale'])!.value,
      customerID: this.editForm.get(['customerID'])!.value,
    };
  }

  public subscribeToSaveResponse(result: Observable<HttpResponse<ISales>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }

  trackById(index: number, item: ICustomerDetails): any {
    return item.id;
  }
}
