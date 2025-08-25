import { Stores } from "../../interface/store.interface";
import { AccountUser, AccountUserUpdatePassword } from "./../../interface/account.interface";


export class SetUserInfo {
  static readonly type = '[Account] Set User Info';
  constructor(public payload: any) {}
}


export class GetPermissionsOnly {
  static readonly type = "[Account] Permission Get";
}
export class GetUserDetails {
  static readonly type = "[Account] User Get";
}

export class UpdateUserProfile {
  static readonly type = "[Account] User Update";
  constructor(public payload: AccountUser, public id:number) {}
}

export class UpdateUserPassword {
  static readonly type = "[Account] User Update Password";
  constructor(public payload: AccountUserUpdatePassword, public id:number) {}
}


export class AccountClear {
  static readonly type = "[Account] Clear";
  constructor() {}
}