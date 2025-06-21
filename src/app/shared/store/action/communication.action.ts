import { Params } from "../../interface/core.interface";

export class SetLoadingState {
  static readonly type = "[Communication] Set Loading State";
  constructor(public isLoading: boolean) {}
}

export class SendMessage {
  static readonly type = "[Communication] Message";
  constructor(public payload: any) {}
}
