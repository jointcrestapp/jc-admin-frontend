
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
    path: "",
    component: OrderCreditSalesComponent
  },
  {
    path: "requested_credit_sales",
    component: RequestedCreditSalesComponent
  },
  {
    path: "approved_credit_sales",
    component: ApprovedCreditSalesComponent
  },
  {
    path: "dispatched_credit_sales",
    component: DispatchedCreditSalesComponent
  },
  {
    path: "ordered_products",
    component: OrderedProductsComponent
  },
  {
    path: "repayment",
    component: RepaymentComponent
  },
  {
    path: "add_batch_repayment",
    component: AddBatchRepaymentComponent
  },
];
