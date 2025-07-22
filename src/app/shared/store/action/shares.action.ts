import { Params } from "../../interface/core.interface";

export class SetLoadingState {
  static readonly type = "[Shares] Set Loading State";
  constructor(public isLoading: boolean) {}
}

export class GetShares {
  static readonly type = "[Shares] Get";
  constructor(public payload?: Params) {}
}

export class EditShares {
  static readonly type = "[Shares] Edit";
  constructor(public id: number) {}
}

export class CreateShares {
  static readonly type = "[Shares] Create";
  constructor(public payload: any) {}
}

export class UpdateShares {
  static readonly type = "[Shares] Update";
  constructor(public payload: any, public id: number) {}
}

export class GetFilteredMembers {
  static readonly type = "[Shares] Get Filtered Members";
  constructor(public payload?: Params) {}
}

export class DeleteShares {
  static readonly type = "[Shares] Delete";
  constructor(public id: number) {}
}

export class AddBatchShares {
  static readonly type = "[Shares] Add Batch Shares";
  constructor(public payload: any) {}
}

export class GenerateSharesTemplate {
  static readonly type = "[Shares] Generate";
  constructor(public payload?: Params) {}
}
