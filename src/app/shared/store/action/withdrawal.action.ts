import { Params } from "../../interface/core.interface";

export class SetLoadingState {
  static readonly type = "[Loading] Set Loading State";
  constructor(public isLoading: boolean) {}
}

export class GetWithdrawRequest {
  static readonly type = "[Withdraw] Get";
  constructor(public payload?: Params) {}
}

export class GetPendingWithdraw {
  static readonly type = "[Withdraw] Get Pending";
  constructor(public payload?: Params) {}
}

export class UpdateWithdrawStatus {
  static readonly type = "[Withdraw] Update";
  constructor(public id: number, public status: boolean) {}
}

export class WithdrawRequest {
  static readonly type = "[Withdraw] Request";
  constructor(public payload: Params) {}
}

export class GetFilteredMembers {
  static readonly type = "[Withdraw] Get Filtered Members";
  constructor(public payload?: Params) {}
}

export class UpdateWithdrawal {
  static readonly type = "[Withdraw] Update";
  constructor(public payload: any, public id: number) {}
}

export class EditWithdrawal {
  static readonly type = "[Withdraw] Edit";
  constructor(public id: number) {}
}

export class CreateWithdrawal {
  static readonly type = "[Withdraw] Create";
  constructor(public payload: any) {}
}
