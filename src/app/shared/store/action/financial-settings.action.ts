import { Params } from "../../interface/core.interface";

export class SetLoadingState {
  static readonly type = "[Loading] Set Loading State";
  constructor(public isLoading: boolean) {}
}

export class addUpdateFinancialSettings {
  static readonly type = "[FinancialSettings] Add or Update";
  constructor(public payload: any) {}
}
export class GetFinancialSettingsList {
  static readonly type = "[FinancialSettings] Get";
  constructor() {}
}
