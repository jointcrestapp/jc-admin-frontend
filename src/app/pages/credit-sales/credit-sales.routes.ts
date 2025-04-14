
import { Routes } from '@angular/router';

import { AddBatchRepaymentComponent } from './add-batch-repayment/add-batch-repayment.component';
import { ApprovedCreditSalesComponent } from './approved-credit-sales/approved-credit-sales.component';
import { DispatchedCreditSalesComponent } from './dispatched-credit-sales/dispatched-credit-sales.component';
import { OrderCreditSalesComponent } from './order-credit-sales/order-credit-sales.component';
import { OrderedProductsComponent } from './ordered-products/ordered-products.component';
import { RepaymentComponent } from './repayment/repayment.component';
import { RequestedCreditSalesComponent } from './requested-credit-sales/requested-credit-sales.component';

export const creditSalesRoutes: Routes = [
  {
    path: "order-credit-sales",
    component: OrderCreditSalesComponent
  },
  {
    path: "requested-credit-sales",
    component: RequestedCreditSalesComponent
  },
  {
    path: "approved-credit-sales",
    component: ApprovedCreditSalesComponent
  },
  {
    path: "dispatched-credit-sales",
    component: DispatchedCreditSalesComponent
  },
  {
    path: "ordered-products",
    component: OrderedProductsComponent
  },
  {
    path: "repayment",
    component: RepaymentComponent
  },
  {
    path: "add-batch-repayment",
    component: AddBatchRepaymentComponent
  },
];
