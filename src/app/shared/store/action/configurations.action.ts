import { Params } from "../../interface/core.interface";

export class SetLoadingState {
  static readonly type = "[Loading] Set Loading State";
  constructor(public isLoading: boolean) {}
}

export class GetCurrencies {
  static readonly type = "[Configurations] Get Currencies";
  constructor(public payload?: Params) {}
}

export class DeleteCurrency {
  static readonly type = "[Configurations] Delete Currency";
  constructor(public id: number) {}
}

export class EditCurrency {
  static readonly type = "[Configurations] Edit Currency";
  constructor(public id: number) {}
}

export class CreateCurrency {
  static readonly type = "[Configurations] Create Currency";
  constructor(public payload: any) {}
}

export class UpdateCurrency {
  static readonly type = "[Configurations] Update Currency";
  constructor(public payload: any, public id: number) {}
}

//Subscription Fee
export class GetSubscriptionFees {
  static readonly type = "[Configurations] Get Subscription Fees";
  constructor(public payload?: Params) {}
}

export class DeleteSubscriptionFee {
  static readonly type = "[Configurations] Delete SUbscription Fee";
  constructor(public id: number) {}
}

export class EditSubscriptionFee {
  static readonly type = "[Configurations] Edit Subscription Fee";
  constructor(public id: number) {}
}

export class CreateSubscriptionFee {
  static readonly type = "[Configurations] Create SUbscriptionFee";
  constructor(public payload: any) {}
}

export class UpdateSubscriptionFee {
  static readonly type = "[Configurations] Update Subscription";
  constructor(public payload: any, public id: number) {}
}

//Shares Amount
export class GetSharesAmount {
  static readonly type = "[Configurations] Get Shares Amount";
  constructor(public payload?: Params) {}
}

export class DeleteShareAmount {
  static readonly type = "[Configurations] Delete Share Amount";
  constructor(public id: number) {}
}

export class EditShareAmount {
  static readonly type = "[Configurations] Edit Share Amount";
  constructor(public id: number) {}
}

export class CreateShareAmount {
  static readonly type = "[Configurations] Create Share Amount";
  constructor(public payload: any) {}
}

export class UpdateShareAmount {
  static readonly type = "[Configurations] Update Share Amount";
  constructor(public payload: any, public id: number) {}
}

//Thrift Categories
export class GetThriftCategories {
  static readonly type = "[Configurations] Get Thrift Categories";
  constructor(public payload?: Params) {}
}

export class CreateThriftCategory {
  static readonly type = "[Configurations] Create Thrift Category";
  constructor(public payload: any) {}
}

export class EditThriftCategory {
  static readonly type = "[Configurations] Edit Thrift Category";
  constructor(public id: number) {}
}

export class UpdateThriftCategory {
  static readonly type = "[Configurations] Update Thrift Category";
  constructor(public payload: any, public id: number) {}
}

export class DeleteThriftCategory {
  static readonly type = "[Configurations] Delete Thrift Category";
  constructor(public id: number) {}
}

//Thrift Tiers
export class GetThriftTiers {
  static readonly type = "[Configurations] Get Thrift Tiers";
  constructor(public payload?: Params) {}
}

export class CreateThriftTier {
  static readonly type = "[Configurations] Create Thrift Tier";
  constructor(public payload: any) {}
}

export class EditThriftTier {
  static readonly type = "[Configurations] Edit Thrift Tier";
  constructor(public id: number) {}
}

export class UpdateThriftTier {
  static readonly type = "[Configurations] Update Thrift Tier";
  constructor(public payload: any, public id: number) {}
}

export class DeleteThriftTier {
  static readonly type = "[Configurations] Delete Thrift Tier";
  constructor(public id: number) {}
}

//Investment Types
export class GetInvestmentTypes {
  static readonly type = "[Configurations] Get Investment Types";
  constructor(public payload?: Params) {}
}

export class CreateInvestmentType {
  static readonly type = "[Configurations] Create Investment Type";
  constructor(public payload: any) {}
}

export class EditInvestmentType {
  static readonly type = "[Configurations] Edit Investment Type";
  constructor(public id: number) {}
}

export class UpdateInvestmentType {
  static readonly type = "[Configurations] Update Investment Type";
  constructor(public payload: any, public id: number) {}
}

export class DeleteInvestmentType {
  static readonly type = "[Configurations] Delete Investment Type";
  constructor(public id: number) {}
}

//Vendors
export class GetVendors {
  static readonly type = "[Configurations] Get Vendors";
  constructor(public payload?: Params) {}
}

export class CreateVendor {
  static readonly type = "[Configurations] Create Vendor";
  constructor(public payload: any) {}
}

export class EditVendor {
  static readonly type = "[Configurations] Edit Vendor";
  constructor(public id: number) {}
}

export class UpdateVendor {
  static readonly type = "[Configurations] Update Vendor";
  constructor(public payload: any, public id: number) {}
}

export class DeleteVendor {
  static readonly type = "[Configurations] Delete Vendor";
  constructor(public id: number) {}
}

//Product Plans
export class GetProductPlans {
  static readonly type = "[Configurations] Get Product Plans";
  constructor(public payload?: Params) {}
}

export class CreateProductPlan {
  static readonly type = "[Configurations] Create Product Plan";
  constructor(public payload: any) {}
}

export class EditProductPlan {
  static readonly type = "[Configurations] Edit Product Plan";
  constructor(public id: number) {}
}

export class UpdateProductPlan {
  static readonly type = "[Configurations] Update Product Plan";
  constructor(public payload: any, public id: number) {}
}

export class DeleteProductPlan {
  static readonly type = "[Configurations] Delete Product Plan";
  constructor(public id: number) {}
}

//Products
export class GetProducts {
  static readonly type = "[Configurations] Get Products";
  constructor(public payload?: Params) {}
}

export class CreateProduct {
  static readonly type = "[Configurations] Create Product";
  constructor(public payload: any) {}
}

export class EditProduct {
  static readonly type = "[Configurations] Edit Product";
  constructor(public id: number) {}
}

export class UpdateProduct {
  static readonly type = "[Configurations] Update Product";
  constructor(public payload: any, public id: number) {}
}

export class DeleteProduct {
  static readonly type = "[Configurations] Delete Product";
  constructor(public id: number) {}
}

// Loan Types
export class GetLoanTypes {
  static readonly type = "[Configurations] Get Loan Types";
  constructor(public payload?: Params) {}
}

export class CreateLoanType {
  static readonly type = "[Configurations] Create Loan Type";
  constructor(public payload: any) {}
}

export class EditLoanType {
  static readonly type = "[Configurations] Edit Loan Type";
  constructor(public id: number) {}
}

export class UpdateLoanType {
  static readonly type = "[Configurations] Update Loan Type";
  constructor(public payload: any, public id: number) {}
}

export class DeleteLoanType {
  static readonly type = "[Configurations] Delete Loan Type";
  constructor(public id: number) {}
}

// Shares Types
export class GetSharesTypes {
  static readonly type = "[Configurations] Get Shares Types";
  constructor(public payload?: Params) {}
}

export class CreateSharesType {
  static readonly type = "[Configurations] Create Shares Type";
  constructor(public payload: any) {}
}

export class EditSharesType {
  static readonly type = "[Configurations] Edit Shares Type";
  constructor(public id: number) {}
}

export class UpdateSharesType {
  static readonly type = "[Configurations] Update Shares Type";
  constructor(public payload: any, public id: number) {}
}

export class UpdateSharesTypeStatus {
  static readonly type = "[Configurations] Update Shares Type Status";
  constructor(public payload: any, public id: number) {}
}

// Savings Types
export class GetSavingsTypes {
  static readonly type = "[Configurations] Get Savings Types";
  constructor(public payload?: Params) {}
}

export class CreateSavingsType {
  static readonly type = "[Configurations] Create Savings Type";
  constructor(public payload: any) {}
}

export class EditSavingsType {
  static readonly type = "[Configurations] Edit Savings Type";
  constructor(public id: number) {}
}

export class UpdateSavingsType {
  static readonly type = "[Configurations] Update Savings Type";
  constructor(public payload: any, public id: number) {}
}

export class UpdateSavingsTypeStatus {
  static readonly type = "[Configurations] Update Savings Type Status";
  constructor(public payload: any, public id: number) {}
}

// User Roles
export class GetUserRoles {
  static readonly type = "[Configurations] Get User Roles";
  constructor(public payload?: Params) {}
}

export class CreateUserRole {
  static readonly type = "[Configurations] Create User Role";
  constructor(public payload: any) {}
}

export class EditUserRole {
  static readonly type = "[Configurations] Edit User Role";
  constructor(public id: number) {}
}

export class UpdateUserRole {
  static readonly type = "[Configurations] Update User Role";
  constructor(public payload: any, public id: number) {}
}

export class DeleteUserRole {
  static readonly type = "[Configurations] Delete User Role";
  constructor(public id: number) {}
}
