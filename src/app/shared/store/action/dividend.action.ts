import { Params } from "../../interface/core.interface";

export class SetLoadingState {
  static readonly type = "[Dividend] Set Loading State";
  constructor(public isLoading: boolean) {}
}

export class GetDividends {
  static readonly type = "[Dividend] Get";
  constructor(public payload?: Params) {}
}

export class CreateDividend {
  static readonly type = "[Dividend] Create";
  constructor(public payload: any) {}
}

export class GetFilteredMembers {
  static readonly type = "[Dividend] Get Filtered Members";
  constructor(public payload?: Params) {}
}

export class ExportDividends {
  static readonly type = "[Dividend] Export";
  constructor(public customData?: any[]) {}
}

// Monthly profit actions
export class GetMonthlyProfits {
  static readonly type = "[Dividend] Get Monthly Profits";
  constructor(public payload?: Params) {}
}

export class AddMonthlyProfit {
  static readonly type = "[Dividend] Add Monthly Profit";
  constructor(public payload: any) {}
}

export class DeleteMonthlyProfit {
  static readonly type = "[Dividend] Delete Monthly Profit";
  constructor(public id: number) {}
}
