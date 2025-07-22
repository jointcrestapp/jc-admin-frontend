import { Params } from "../../interface/core.interface";

export class SetLoadingState {
  static readonly type = "[Settings] Set Loading State";
  constructor(public isLoading: boolean) {}
}

export class CreateCooperative {
  static readonly type = "[Settings] Create Cooperative";
  constructor(public payload: any) {}
}

export class CreateLoanApplicationConfiguration {
  static readonly type = "[Settings] Create Loan Application Configuration";
  constructor(public payload: any) {}
}

export class CreateNotificationConfiguration {
  static readonly type = "[Settings] Create Notification Configuration";
  constructor(public payload: any) {}
}
export class CreateMemberManagementSettings {
  static readonly type = "[Settings] Create Member Management Settings";
  constructor(public payload: any) {}
}

export class CreatePaymentGatewayConfiguration {
  static readonly type = "[Settings] Create Payment Gateway Configuration";
  constructor(public payload: any) {}
}
