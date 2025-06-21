export class GetCountries {
  static readonly type = "[Country] Get";
  constructor() {}
}

export class GetStates {
  static readonly type = "[State] Get";
  constructor(public id: number) {}
}