import { Route } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { SalesCartComponent } from './sales-cart.component';

export const SALES_CART_ROUTE: Route = {
  path: 'sales-cart',
  component: SalesCartComponent,
  data: {
    authorities: [],
    pageTitle: 'sales-cart.title'
  },
  canActivate: [UserRouteAccessService]
};
