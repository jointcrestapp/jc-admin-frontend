import { Params } from "../../interface/core.interface";

export class SetLoadingState {
  static readonly type = "[Loading] Set Loading State";
  constructor(public isLoading: boolean) {}
}

export class GetSubscriptionList {
  static readonly type = "[Subscription] Get";
  constructor(public payload?: Params) {}
}
