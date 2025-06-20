import { Params } from "../../interface/core.interface";

export class SetLoadingState {
  static readonly type = "[Loading] Set Loading State";
  constructor(public isLoading: boolean) {}
}

export class GetSavings {
  static readonly type = "[Savings] Get";
  constructor(public payload?: Params) {}
}

export class EditSavings {
  static readonly type = "[Savings] Edit";
  constructor(public id: number) {}
}

export class CreateSavings {
  static readonly type = "[Savings] Create";
  constructor(public payload: any) {}
}

export class UpdateSavings {
  static readonly type = "[Savings] Update";
  constructor(public payload: any, public id: number) {}
}

export class GetFilteredMembers {
  static readonly type = "[Savings] Get Filtered Members";
  constructor(public payload?: Params) {}
}

export class DeleteSaving {
  static readonly type = "[Savings] Delete";
  constructor(public id: number) {}
}

export class AddBatchSavings {
  static readonly type = "[Savings] Add Batch Savings";
  constructor(public payload: any) {}
}

export class GenerateSavingsTemplate {
  static readonly type = "[Savings] Generate";
  constructor(public payload?: Params) {}
}
