import { Params } from "../../interface/core.interface";

export class SetLoadingState {
  static readonly type = "[Loading] Set Loading State";
  constructor(public isLoading: boolean) {}
}

export class OrderCreditSales {
  static readonly type = "[Credit] Order Credit Sales";
  constructor(public payload?: Params) {}
}

export class AddCreditSales {
  static readonly type = "[Credit] Add";
  constructor(public payload: any) {}
}
export class RequestedCreditSales {
  static readonly type = "[Credit] Requested Credit Sales";
  constructor(public payload?: Params) {}
}

export class ApproveCreditSalesStatus {
  static readonly type = "[Credit] Approve Credit Sales Status";
  constructor(public payload: any, public id: number) {}
}

export class DeleteCreditSales {
  static readonly type = "[Credit] Delete Credit Sales";
  constructor(public id: number) {}
}

export class ApprovedCreditSales {
  static readonly type = "[Credit] Approved Credit Sales";
  constructor(public payload?: Params) {}
}

export class DispatchedCreditSales {
  static readonly type = "[Credit] Dispatched Credit Sales";
  constructor(public payload?: Params) {}
}

export class DispatchCreditSalesStatus {
  static readonly type = "[Credit] Dispatch Credit Sales Status";
  constructor(public payload: any, public id: number) {}
}

export class OrderedProducts {
  static readonly type = "[Credit] Ordered Products";
  constructor(public payload?: Params) {}
}

export class EditCredit {
  static readonly type = "[Credit] Edit";
  constructor(public id: number) {}
}

export class ExportCredits {
  static readonly type = "[Cedit] Export";
  constructor(
    public creditType:
      | "requested_credit_sales"
      | "approved_credit_sales"
      | "disbursed_credit_sales"
      | "ordered_products"
      | "repayments"
      | "custom_selection" = "requested_credit_sales",
    public customData?: any[]
  ) {}
}
