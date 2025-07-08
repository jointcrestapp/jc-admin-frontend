import { Params } from "../../interface/core.interface";

export class SetLoadingState {
  static readonly type = "[Miscellaneous] Set Loading State";
  constructor(public isLoading: boolean) {}
}

export class GetByeLaws {
  static readonly type = "[Miscellaneous] Get";
  constructor(public payload?: Params) {}
}

export class EditByeLaw {
  static readonly type = "[Miscellaneous] Edit";
  constructor(public id: number) {}
}

export class CreateByeLaw {
  static readonly type = "[Miscellaneous] Create";
  constructor(public payload: any) {}
}

export class UpdateByeLaw {
  static readonly type = "[Miscellaneous] Update";
  constructor(public payload: any, public id: number) {}
}

export class DeleteByeLaw {
  static readonly type = "[Miscellaneous] Delete";
  constructor(public id: number) {}
}
export class GetMinutes {
  static readonly type = "[Miscellaneous] Get Minutes";
  constructor(public payload?: Params) {}
}

export class EditMinute {
  static readonly type = "[Miscellaneous] Edit Minute";
  constructor(public id: number) {}
}

export class CreateMinute {
  static readonly type = "[Miscellaneous] Create Minute";
  constructor(public payload: any) {}
}

export class UpdateMinute {
  static readonly type = "[Miscellaneous] Update Minute";
  constructor(public payload: any, public id: number) {}
}

export class DeleteMinute {
  static readonly type = "[Miscellaneous] Delete Minute";
  constructor(public id: number) {}
}

export class GetTrainingSeminar {
  static readonly type = "[Miscellaneous] Get TS";
  constructor(public payload?: Params) {}
}

export class EditTrainingSeminar {
  static readonly type = "[Miscellaneous] Edit TS";
  constructor(public id: number) {}
}

export class CreateTrainingSeminar {
  static readonly type = "[Miscellaneous] Create TS";
  constructor(public payload: any) {}
}

export class UpdateTrainingSeminar {
  static readonly type = "[Miscellaneous] Update TS";
  constructor(public payload: any, public id: number) {}
}

export class DeleteTrainingSeminar {
  static readonly type = "[Miscellaneous] Delete TS";
  constructor(public id: number) {}
}
