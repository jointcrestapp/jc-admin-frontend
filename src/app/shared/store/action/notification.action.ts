import { Params } from "../../interface/core.interface";

export class GetNotification {
  static readonly type = "[Notification] Get";
  constructor(public payload?: Params) {}
}

export class MarkAsReadNotification {
  static readonly type = "[Notification] Mark As Read";
  constructor() {}
}

export class DeleteNotification {
  static readonly type = "[Notification] Delete";
  constructor(public id: string) {}
}
export class NotificationClear {
  static readonly type = "[Notification] Clear";
  constructor() {}
}