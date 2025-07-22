import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { CryptoService } from "../../core//services/crypto.service";
import { environment } from "src/environments/environment.development";
import { BaseApiService } from "./base-api-service";
@Injectable({
  providedIn: "root",
})
export class ReportService extends BaseApiService {
  constructor(http: HttpClient, crypto: CryptoService) {
    super(http, crypto);
  }

  getSavingsReport(filter: any): Observable<any> {
    return this.get(`${environment.apiURL}/get_savings_report`, filter);
  }

  getSharesReport(filter: any): Observable<any> {
    return this.get(`${environment.apiURL}/get_shares_report`, filter);
  }

  getLoanReport(filter: any): Observable<any> {
    return this.get(`${environment.apiURL}/get_loan_report`, filter);
  }

  getCreditSalesReport(filter: any): Observable<any> {
    return this.get(`${environment.apiURL}/get_credit_sales_report`, filter);
  }

  getLedgerBalance(filter: any): Observable<any> {
    return this.get(`${environment.apiURL}/get_ledger_balance`, filter);
  }
}
