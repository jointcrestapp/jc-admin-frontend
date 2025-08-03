import { Params } from "../../interface/core.interface";
import { User, UserAddress } from "../../interface/user.interface";

export class LoginSuccess {
  static readonly type = "[Auth] Login Success";
  constructor(public payload: { token: string; user: any }) {}
}

export class Logout {
  static readonly type = "[Auth] Logout";
}

export class SetLoadingState {
  static readonly type = "[Loading] Set Loading State";
  constructor(public isLoading: boolean) {}
}

export class GetUsers {
  static readonly type = "[User] Get";
  constructor(public payload?: Params) {}
}

export class DeactivateUser {
  static readonly type = "[User] Deactivate";
  constructor(public id: any) {}
}

export class CreateUser {
  static readonly type = "[User] Create";
  constructor(public payload: any) {}
}
//mine
export class EditUser {
  static readonly type = "[User] Edit";
  constructor(public id: number) {}
}

export class UpdateUser {
  static readonly type = "[User] Update";
  constructor(public payload: any, public id: number) {}
}

export class UpdateUserStatus {
  static readonly type = "[User] Update Status";
  constructor(public id: number, public status: boolean) {}
}

export class DeleteUser {
  static readonly type = "[User] Delete";
  constructor(public id: number) {}
}

export class DeleteAllUser {
  static readonly type = "[User] Delete All";
  constructor(public ids: number[]) {}
}

export class ImportUser {
  static readonly type = "[User] Import";
  constructor(public payload: File[]) {}
}

export class ExportUser {
  static readonly type = "[User] Export";
  constructor(public customData?: any[]) {}
}

export class CreateUserAddress {
  static readonly type = "[User] Address Create";
  constructor(public payload: UserAddress) {}
}
