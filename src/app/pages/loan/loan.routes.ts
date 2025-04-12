
import { Routes } from '@angular/router';

import { AddSingleLoanComponent } from './add-single-loan/add-single-loan.component';
import { AddBatchRepaymentComponent } from './add-batch-repayment/add-batch-repayment.component';
import { RequestedLoansComponent } from './requested-loans/requested-loans.component';
import { ApprovedLoansComponent } from './approved-loans/approved-loans.component';
import { DisbursedLoansComponent } from './disbursed-loans/disbursed-loans.component';
import { FinishedLoansComponent } from './finished-loans/finished-loans.component';
import { LoanRepaymentComponent } from './loan-repayment/loan-repayment.component';
import { DualLoanPaymentComponent } from './dual-loan-payment/dual-loan-payment.component';
import { EditLoanComponent } from './edit-loan/edit-loan.component';

export const loanRoutes: Routes = [
  {
    path: "",
    component: AddSingleLoanComponent
  },
  {
    path: "requested_loans",
    component: RequestedLoansComponent
  },
  {
    path: "approved_loans",
    component: ApprovedLoansComponent
  },
  {
    path: "disbursed_loans",
    component: DisbursedLoansComponent
  },
  {
    path: "finished_loans",
    component: FinishedLoansComponent
  },
  {
    path: "loan_repayment",
    component: LoanRepaymentComponent
  },
  {
    path: "dual_loan_repayment",
    component: DualLoanPaymentComponent
  },
  {
    path: "add_batch_repayment",
    component: AddBatchRepaymentComponent
  },
  {
    path: "edit-loan/:id",
    component: EditLoanComponent
  }
];
