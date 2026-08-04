import { Params } from "../../interface/core.interface";

export class SetLoadingState {
  static readonly type = "[Communication] Set Loading State";
  constructor(public isLoading: boolean) {}
}

export class SendMessage {
  static readonly type = "[Communication] Message";
  constructor(public payload: any) {}
}

export class SendSms {
  static readonly type = "[Communication] Sms";
  constructor(public payload: any) {}
}

export class SendPush {
  static readonly type = "[Communication] Push";
  constructor(public payload: any) {}
}
