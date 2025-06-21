import { Params } from "../../interface/core.interface";


export class SetLoadingState {
  static readonly type = '[Loading] Set Loading State';
  constructor(public isLoading: boolean) {}
}

export class GetThrifts {
  static readonly type = "[Thrifts] Get";
  constructor(public payload?: Params) {}
}

export class GetActiveThriftForUser {
  static readonly type = "[Thrifts] Get Active";
  constructor(public payload?: Params) {}
}

export class EditThrifts {
  static readonly type = '[Thrifts] Edit';
  constructor(public id: number) {}
}

export class CreateThrifts {
  static readonly type = "[Thrifts] Create";
  constructor(public payload: any) {}
}

export class UpdateThrifts {
  static readonly type = "[Thrifts] Update";
  constructor(public payload: any, public id: number) {}
}

export class GetFilteredMembers {
  static readonly type = "[Thrifts] Get Filtered Members";
  constructor(public payload?: Params) {}
}

export class GetThriftsTiers {
  static readonly type = "[Thrifts] Get Thrifts Tiers";
  constructor(public payload?: Params) {}
}

export class GetThriftsCategories {
  static readonly type = "[Thrifts] Get Thrifts Categories";
  constructor(public id: number) {}
}

export class DeleteThrifts {
  static readonly type = "[Thrifts] Delete";
  constructor(public id: number) {}
}