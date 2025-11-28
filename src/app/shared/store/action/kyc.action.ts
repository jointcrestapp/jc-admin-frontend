//KYC
export class GetKYCSubmissions {
  static readonly type = "[KYC] Get Submissions";
  constructor(public payload?: any) {}
}

export class UpdateKYCStatus {
  static readonly type = "[KYC] Update Status";
  constructor(public id: number, public payload: any) {}
}

export class DeleteKYC {
  static readonly type = "[KYC] Delete";
  constructor(public id: number) {}
}
