import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { CryptoService } from "../../core//services/crypto.service";
import { environment } from "src/environments/environment.development";
import { BaseApiService } from "./base-api-service";
@Injectable({
  providedIn: "root",
})
export class CreditService extends BaseApiService {
  constructor(http: HttpClient, crypto: CryptoService) {
    super(http, crypto);
  }

  orderCreditSales(filter: any): Observable<any> {
    return this.get(`${environment.apiURL}/order_credit_sales`, filter);
  }

  addCreditSales(data: any): Observable<any> {
    return this.post(`${environment.apiURL}/add_credit_sales`, data);
  }

  requestedCreditSales(filter: any): Observable<any> {
    return this.get(`${environment.apiURL}/requested_credit_sales`, filter);
  }

  paidCreditSalesHistory(filter: any): Observable<any> {
    return this.get(
      `${environment.apiURL}/credit_sales_repayment_history`,
      filter
    );
  }

  approveCreditSalesStatus(data: any, id: number): Observable<any> {
    return this.patch(
      `${environment.apiURL}/approve_credit_sales_status/${id}`,
      data
    );
  }

  deleteCreditSales(id: number): Observable<any> {
    return this.delete(`${environment.apiURL}/delete_credit_sales/${id}`);
  }

  approvedCreditSales(filter: any): Observable<any> {
    return this.get(`${environment.apiURL}/approved_credit_sales`, filter);
  }

  dispatchedCreditSales(filter: any): Observable<any> {
    return this.get(`${environment.apiURL}/dispatched_credit_sales`, filter);
  }

  dispatchCreditSalesStatus(data: any, id: number): Observable<any> {
    return this.patch(
      `${environment.apiURL}/dispatch_credit_sales_status/${id}`,
      data
    );
  }

  orderedProducts(filter: any): Observable<any> {
    return this.get(`${environment.apiURL}/ordered_products`, filter);
  }
}
