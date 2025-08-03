import { Params } from "../../interface/core.interface";
import { Wallet } from "../../interface/wallet.interface";

export class GetUserTransaction {
  static readonly type = "[Wallet] Transaction Get";
  constructor(public payload?: Params) {}
}

export class SetLoadingState {
  static readonly type = "[Wallet] Set Loading State";
  constructor(public isLoading: boolean) {}
}

export class EditTransaction {
  static readonly type = "[Wallet] Edit";
  constructor(public id: number) {}
}

export class ExportTransactions {
  static readonly type = "[Wallet] Export";
  constructor(public customData?: any[]) {}
}
