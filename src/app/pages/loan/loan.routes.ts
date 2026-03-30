import { Routes } from "@angular/router";

import { AddSingleLoanComponent } from "./add-single-loan/add-single-loan.component";
import { AddBatchLoanComponent } from "./add-batch-loan/add-batch-loan.component";
import { RequestedLoansComponent } from "./requested-loans/requested-loans.component";
import { ApprovedLoansComponent } from "./approved-loans/approved-loans.component";
import { DisbursedLoansComponent } from "./disbursed-loans/disbursed-loans.component";
import { FinishedLoansComponent } from "./finished-loans/finished-loans.component";
import { LoanRepaymentComponent } from "./loan-repayment/loan-repayment.component";
import { DueLoanPaymentComponent } from "./due-loan-payment/due-loan-payment.component";
import { EditLoanComponent } from "./edit-loan/edit-loan.component";
import { DetailsComponent } from "./details/details.component";
import { LoanDetailComponent } from "./loan-detail/loan-detail.component";

export const loanRoutes: Routes = [
  {
    path: "add-single-loan",
    component: AddSingleLoanComponent,
  },
  {
    path: "requested-loans",
    component: RequestedLoansComponent,
  },
  {
    path: "approved-loans",
    component: ApprovedLoansComponent,
  },
  {
    path: "disbursed-loans",
    component: DisbursedLoansComponent,
  },
  {
    path: "finished-loans",
    component: FinishedLoansComponent,
  },
  {
    path: "loan-repayment",
    component: LoanRepaymentComponent,
  },
  {
    path: "due-loan-repayment",
    component: DueLoanPaymentComponent,
  },
  {
    path: "add-batch-loan",
    component: AddBatchLoanComponent,
  },
  {
    path: "edit-loan/:id",
    component: EditLoanComponent,
  },
  {
    path: "details/:id",
    component: DetailsComponent,
  },
  {
    path: "loan-detail/:cat/:id",
    component: LoanDetailComponent,
  },
];
