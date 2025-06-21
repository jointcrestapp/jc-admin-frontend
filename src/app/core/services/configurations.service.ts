import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { CryptoService } from "../../core//services/crypto.service";
import { environment } from "src/environments/environment.development";
import { BaseApiService } from "./base-api-service";
@Injectable({
  providedIn: "root",
})
export class COnfigurationsService extends BaseApiService {
  constructor(http: HttpClient, crypto: CryptoService) {
    super(http, crypto);
  }

  //Currencies Routes
  getCurrencies(filter: any): Observable<any> {
    return this.get(`${environment.apiURL}/get_currencies`, filter);
  }

  updateCurrency(data: any, id: number): Observable<any> {
    return this.put(`${environment.apiURL}/update_currency/${id}`, data);
  }

  //Currencies Routes
  getSubscriptionFees(filter: any): Observable<any> {
    return this.get(`${environment.apiURL}/get_subscription_fees`, filter);
  }

  updateSubscriptionFee(data: any, id: number): Observable<any> {
    return this.put(
      `${environment.apiURL}/update_subscription_fee/${id}`,
      data
    );
  }

  //Shares Amount
  getSharesAmount(filter: any): Observable<any> {
    return this.get(`${environment.apiURL}/get_shares_amount`, filter);
  }

  updateShareAmount(data: any, id: number): Observable<any> {
    return this.put(`${environment.apiURL}/update_share_amount/${id}`, data);
  }

  //Thrift Categories
  getThriftCategories(filter: any): Observable<any> {
    return this.get(`${environment.apiURL}/get_thrift_categories`, filter);
  }

  addThriftCategory(data: any): Observable<any> {
    return this.post(`${environment.apiURL}/add_thrift_category`, data);
  }

  updateThriftCategory(data: any, id: number): Observable<any> {
    return this.put(`${environment.apiURL}/update_thrift_category/${id}`, data);
  }

  deleteThriftCategory(id: number): Observable<any> {
    return this.delete(`${environment.apiURL}/delete_thrift_category/${id}`);
  }
  //Thrift Tiers
  getThriftTiers(filter: any): Observable<any> {
    return this.get(`${environment.apiURL}/get_thrift_tiers`, filter);
  }

  addThriftTier(data: any): Observable<any> {
    return this.post(`${environment.apiURL}/add_thrift_tier`, data);
  }

  updateThriftTier(data: any, id: number): Observable<any> {
    return this.put(`${environment.apiURL}/update_thrift_tier/${id}`, data);
  }

  deleteThriftTier(id: number): Observable<any> {
    return this.delete(`${environment.apiURL}/delete_thrift_tier/${id}`);
  }

  //Investment Types
  getInvestmentTypes(filter: any): Observable<any> {
    return this.get(`${environment.apiURL}/get_investment_types`, filter);
  }

  addInvestmentType(data: any): Observable<any> {
    return this.post(`${environment.apiURL}/add_investment_type`, data);
  }

  updateInvestmentType(data: any, id: number): Observable<any> {
    return this.put(`${environment.apiURL}/update_investment_type/${id}`, data);
  }

  deleteInvestmentType(id: number): Observable<any> {
    return this.delete(`${environment.apiURL}/delete_investment_type/${id}`);
  }

  //Vendors
  getVendors(filter: any): Observable<any> {
    return this.get(`${environment.apiURL}/get_vendors`, filter);
  }

  addVendor(data: any): Observable<any> {
    return this.post(`${environment.apiURL}/add_vendor`, data);
  }

  updateVendor(data: any, id: number): Observable<any> {
    return this.put(`${environment.apiURL}/update_vendor/${id}`, data);
  }

  deleteVendor(id: number): Observable<any> {
    return this.delete(`${environment.apiURL}/delete_vendor/${id}`);
  }

  //Product Plan
  getProductPlans(filter: any): Observable<any> {
    return this.get(`${environment.apiURL}/get_product_plans`, filter);
  }

  addProductPlan(data: any): Observable<any> {
    return this.post(`${environment.apiURL}/add_product_plan`, data);
  }

  updateProductPlan(data: any, id: number): Observable<any> {
    return this.put(`${environment.apiURL}/update_product_plan/${id}`, data);
  }

  deleteProductPlan(id: number): Observable<any> {
    return this.delete(`${environment.apiURL}/delete_product_plan/${id}`);
  }

  //Products
  getProducts(filter: any): Observable<any> {
    return this.get(`${environment.apiURL}/get_products`, filter);
  }

  addProduct(data: any): Observable<any> {
    return this.post(`${environment.apiURL}/add_product`, data);
  }

  updateProduct(data: any, id: number): Observable<any> {
    return this.put(`${environment.apiURL}/update_product/${id}`, data);
  }

  deleteProduct(id: number): Observable<any> {
    return this.delete(`${environment.apiURL}/delete_product/${id}`);
  }

  // Loan Types
  getLoanTypes(filter: any): Observable<any> {
    return this.get(`${environment.apiURL}/get_loan_types`, filter);
  }

  addLoanType(data: any): Observable<any> {
    return this.post(`${environment.apiURL}/add_loan_type`, data);
  }

  updateLoanType(data: any, id: number): Observable<any> {
    return this.put(`${environment.apiURL}/update_loan_type/${id}`, data);
  }

  deleteLoanType(id: number): Observable<any> {
    return this.delete(`${environment.apiURL}/delete_loan_type/${id}`);
  }

  // Shares Types
  getSharesTypes(filter: any): Observable<any> {
    return this.get(`${environment.apiURL}/get_shares_types`, filter);
  }

  addSharesType(data: any): Observable<any> {
    return this.post(`${environment.apiURL}/add_shares_type`, data);
  }

  updateSharesType(data: any, id: number): Observable<any> {
    return this.put(`${environment.apiURL}/update_shares_type/${id}`, data);
  }

  updateSharesTypeStatus(data: any, id: number): Observable<any> {
    return this.patch(
      `${environment.apiURL}/update_shares_type_status/${id}`,
      data
    );
  }

  // Savings Types
  getSavingsTypes(filter: any): Observable<any> {
    return this.get(`${environment.apiURL}/get_savings_types`, filter);
  }

  addSavingsType(data: any): Observable<any> {
    return this.post(`${environment.apiURL}/add_savings_type`, data);
  }

  updateSavingsType(data: any, id: number): Observable<any> {
    return this.put(`${environment.apiURL}/update_savings_type/${id}`, data);
  }

  updateSavingsTypeStatus(data: any, id: number): Observable<any> {
    return this.patch(
      `${environment.apiURL}/update_savings_type_status/${id}`,
      data
    );
  }

  // User Roles
  getUserRoles(filter: any): Observable<any> {
    return this.get(`${environment.apiURL}/get_user_roles`, filter);
  }

  addUserRole(data: any): Observable<any> {
    return this.post(`${environment.apiURL}/add_user_role`, data);
  }

  updateUserRole(data: any, id: number): Observable<any> {
    return this.put(`${environment.apiURL}/update_user_role/${id}`, data);
  }

  deleteUserRole(id: number): Observable<any> {
    return this.delete(`${environment.apiURL}/delete_user_role/${id}`);
  }
}
