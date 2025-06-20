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
