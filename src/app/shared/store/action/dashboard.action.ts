import { Params } from "../../interface/core.interface";

export class SetLoadingState {
  static readonly type = "[Dashboard] Set Loading State";
  constructor(public isLoading: boolean) {}
}

export class GetStatisticsCount {
  static readonly type = "[Dashboard] Statistics Count Get";
  constructor(public payload?: Params) {}
}

export class GetNotifications {
  static readonly type = "[Dashboard] Notifications";
  constructor(public payload?: Params) {}
}

export class GetRevenueChart {
  static readonly type = "[Dashboard] Revenue Get";
}


export class DashboardClear {
  static readonly type = "[Dashboard] Clear";
  constructor() {}
}