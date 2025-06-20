import { Params } from "../../interface/core.interface";

export class SetLoadingState {
  static readonly type = "[Loan] Set Loading State";
  constructor(public isLoading: boolean) {}
}

export class GetLoan {
  static readonly type = "[Loan] Get";
  constructor(public payload?: Params) {}
}

export class GetLoanType {
  static readonly type = "[Loan] Get Loan Type";
  constructor(public payload?: Params) {}
}

export class GetApprovedLoan {
  static readonly type = "[Loan] Get Approved";
  constructor(public payload?: Params) {}
}

export class GetDisbursedLoan {
  static readonly type = "[Loan] Get Disbursed";
  constructor(public payload?: Params) {}
}

export class GetFinishedLoan {
  static readonly type = "[Loan] Get Finished";
  constructor(public payload?: Params) {}
}

export class EditLoan {
  static readonly type = "[Loan] Edit";
  constructor(public id: number) {}
}

export class EditDisbursedLoan {
  static readonly type = "[Loan] Edit Disbursed";
  constructor(public id: number) {}
}

export class EditApprovedLoan {
  static readonly type = "[Loan] Edit Approved";
  constructor(public id: number) {}
}

export class EditFinishedLoan {
  static readonly type = "[Loan] Edit Finished";
  constructor(public id: number) {}
}

export class CreateLoan {
  static readonly type = "[Loan] Create";
  constructor(public payload: any) {}
}

export class UpdateLoan {
  static readonly type = "[Loan] Update";
  constructor(public payload: any, public id: number) {}
}

export class GetFilteredMembers {
  static readonly type = "[Loan] Get Filtered Members";
  constructor(public payload?: Params) {}
}

export class DeleteLoan {
  static readonly type = "[Loan] Delete";
  constructor(public id: number) {}
}

export class ApproveLoanStatus {
  static readonly type = "[Loan] Approve Loan Status";
  constructor(public payload: any, public id: number) {}
}

export class DispatchLoanStatus {
  static readonly type = "[Loan] Dispatch Loan Status";
  constructor(public payload: any, public id: number) {}
}

export class GetPaidLoan {
  static readonly type = "[Loan] Get Paid Loan";
  constructor(public payload?: Params) {}
}
export class GetDueLoan {
  static readonly type = "[Loan] Get Due Loan";
  constructor(public payload?: Params) {}
}

export class AddBatchLoan {
  static readonly type = "[Loan] Add Batch Loan";
  constructor(public payload: any) {}
}

export class GenerateLoanTemplate {
  static readonly type = "[Loan] Generate";
  constructor(public payload?: Params) {}
}
