import { Route } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { SalesMenuComponent } from './sales-menu.component';

export const SALES_MENU_ROUTE: Route = {
  path: 'sales-menu',
  component: SalesMenuComponent,
  data: {
    authorities: [],
    pageTitle: 'sales-menu.title'
  },
  canActivate: [UserRouteAccessService]
};
