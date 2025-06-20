import { Params } from "../../interface/core.interface";

export class SetLoadingState {
  static readonly type = "[Investment] Set Loading State";
  constructor(public isLoading: boolean) {}
}

//Investment Types
export class GetInvestments {
  static readonly type = "[Investment] Get Investments";
  constructor(public payload?: Params) {}
}

export class CreateInvestment {
  static readonly type = "[Investment] Create Investment";
  constructor(public payload: any) {}
}

export class EditInvestment {
  static readonly type = "[Investment] Edit Investment";
  constructor(public id: number) {}
}

export class UpdateInvestment {
  static readonly type = "[Investment] Update Investment";
  constructor(public payload: any, public id: number) {}
}

export class DeleteInvestment {
  static readonly type = "[Investment] Delete Investment";
  constructor(public id: number) {}
}
