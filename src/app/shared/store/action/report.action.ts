import { Params } from "../../interface/core.interface";

export class SetLoadingState {
  static readonly type = "[Loading] Set Loading State";
  constructor(public isLoading: boolean) {}
}

export class GetSavingsReport {
  static readonly type = "[Reports] Get Savings Report";
  constructor(public payload?: Params) {}
}

export class GetSharesReport {
  static readonly type = "[Reports] Get Shares Report";
  constructor(public payload?: Params) {}
}

export class GetLoanReport {
  static readonly type = "[Reports] Get Loan Report";
  constructor(public payload?: Params) {}
}

export class GetCreditSalesReport {
  static readonly type = "[Reports] Get Credit Sales Report";
  constructor(public payload?: Params) {}
}

export class GetLedgerBalance {
  static readonly type = "[Reports] Get Ledger Balance";
  constructor(public payload?: Params) {}
}

export class ExportReport {
  static readonly type = "[Report] Export";
  constructor(
    public reportType:
      | "savings_report"
      | "shares_report"
      | "loan_report"
      | "credit_sales_report"
      | "ledger_balance_report"
      | "custom_selection" = "savings_report",
    public customData?: any[]
  ) {}
}
