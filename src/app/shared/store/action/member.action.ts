import { Params } from "../../interface/core.interface";
import { User, UserAddress } from "../../interface/user.interface";

export class SetLoadingState {
  static readonly type = "[Loading] Set Loading State";
  constructor(public isLoading: boolean) {}
}

export class GetMembers {
  static readonly type = "[Member] Get";
  constructor(public payload?: Params) {}
}

export class GetAgents {
  static readonly type = "[Member] Get Agents";
  constructor(public payload?: Params) {}
}

export class GetPendingMembers {
  static readonly type = "[Member] Get Pending Members";
  constructor(public payload?: Params) {}
}

export class GetExitedMembers {
  static readonly type = "[Member] Get Exited Members";
  constructor(public payload?: Params) {}
}

export class GetAccountRequestClosure {
  static readonly type = "[Member] Get  Account Request Closure";
  constructor(public payload?: Params) {}
}

export class DeactivateMember {
  static readonly type = "[Member] Deactivate";
  constructor(public id: any) {}
}

export class CreateMember {
  static readonly type = "[Member] Create";
  constructor(public payload: any) {}
}
//mine
export class EditMember {
  static readonly type = "[Member] Edit";
  constructor(public id: number) {}
}

export class GetStatistics {
  static readonly type = "[Member] Statictis Count Get";
  constructor(public payload?: Params) {}
}

export class UpdateMember {
  static readonly type = "[Member] Update";
  constructor(public payload: any, public id: number) {}
}

export class GetBanks {
  static readonly type = "[Member] Get Banks";
  constructor() {}
}

export class GetBankCode {
  static readonly type = "[Member] Get Bank Code";
  constructor(public id: number) {}
}

export class GetBankKYC {
  static readonly type = "[Member] Get Bank KYC";
  constructor(public payload: any) {}
}

export class UpdateMemberStatus {
  static readonly type = "[Member] Update Status";
  constructor(public id: number, public status: boolean) {}
}

export class ReactivateMember {
  static readonly type = "[Member] Reactivate Member";
  constructor(public id: number) {}
}

export class UpdateDeleteStatus {
  static readonly type = "[Member] Update Delete";
  constructor(public id: number, public request_id: number) {}
}

export class DeleteMember {
  static readonly type = "[Member] Delete";
  constructor(public id: number) {}
}

export class DeleteAllMember {
  static readonly type = "[Member] Delete All";
  constructor(public ids: number[]) {}
}

export class ImportMember {
  static readonly type = "[Member] Import";
  constructor(public payload: File[]) {}
}

export class ExportMember {
  static readonly type = "[Member] Export";
  constructor(
    public memberType:
      | "all_members"
      | "pending_members"
      | "exited_members"
      | "account_closure_request"
      | "agents"
      | "custom_selection" = "all_members",
    public customData?: any[]
  ) {}
}

export class CreateMemberAddress {
  static readonly type = "[Member] Address Create";
  constructor(public payload: UserAddress) {}
}
