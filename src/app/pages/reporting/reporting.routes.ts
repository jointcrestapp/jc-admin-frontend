
import { Routes } from '@angular/router';
import { SavingsReportComponent } from './reports/savings-report/savings-report.component';
import { SharesReportComponent } from './reports/shares-report/shares-report.component';
import { RevenueReportComponent } from './reports/revenue-report/revenue-report.component';
import { LoanReportComponent } from './reports/loan-report/loan-report.component';
import { CreditSalesReportComponent } from './reports/credit-sales-report/credit-sales-report.component';
import { LedgerBalanceComponent } from './reports/ledger-balance/ledger-balance.component';
import { StatementComponent } from './statement/statement.component';




export const reportingRoutes: Routes = [
  {
    path: '',
    component: SavingsReportComponent
  },
  {
    path: 'shares-report',
    component: SharesReportComponent
  },
  {
    path: 'revenue-report',
    component: RevenueReportComponent
  },
  {
    path: 'loan-report',
    component: LoanReportComponent
  },
  {
    path: 'credit-sales-report',
    component: CreditSalesReportComponent
  },
  {
    path: 'ledger-balance-report',
    component: LedgerBalanceComponent
  },
  {
    path: 'statement',
    component: StatementComponent
  }
];
