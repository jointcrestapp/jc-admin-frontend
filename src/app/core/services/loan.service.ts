import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { CryptoService } from "./crypto.service";
import { environment } from "src/environments/environment.development";
import { BaseApiService } from "./base-api-service";
@Injectable({
  providedIn: "root",
})
export class LoanService extends BaseApiService {
  constructor(http: HttpClient, crypto: CryptoService) {
    super(http, crypto);
  }

  getLoanHistory(filter: any): Observable<any> {
    return this.get(`${environment.apiURL}/get_loan_history`, filter);
  }

  getLoanType(filter: any): Observable<any> {
    return this.get(`${environment.apiURL}/get_loan_type`, filter);
  }

  getApprovedLoanHistory(filter: any): Observable<any> {
    return this.get(`${environment.apiURL}/get_approved_loan_history`, filter);
  }

  getDisbursedLoanHistory(filter: any): Observable<any> {
    return this.get(`${environment.apiURL}/get_disbursed_loan_history`, filter);
  }

  getFinishedLoanHistory(filter: any): Observable<any> {
    return this.get(`${environment.apiURL}/get_finished_loan_history`, filter);
  }

  saveLoanRequest(data: any): Observable<any> {
    return this.post(`${environment.apiURL}/save_loan_request`, data);
  }

  getFilteredMember(filter: any): Observable<any> {
    return this.get(`${environment.apiURL}/get_filtered_members`, filter);
  }

  updateLoan(data: any, id: number): Observable<any> {
    return this.put(`${environment.apiURL}/update_loan/${id}`, data);
  }

  deleteLoan(id: number): Observable<any> {
    return this.delete(`${environment.apiURL}/delete_loan/${id}`);
  }

  approveLoanStatus(data: any, id: number): Observable<any> {
    return this.patch(`${environment.apiURL}/approve_loan_status/${id}`, data);
  }

  dispatchLoanStatus(data: any, id: number): Observable<any> {
    return this.patch(`${environment.apiURL}/dispatch_loan_status/${id}`, data);
  }

  getPaidLoanHistory(filter: any): Observable<any> {
    return this.get(`${environment.apiURL}/get_paid_loan_history`, filter);
  }

  getDueLoanHistory(filter: any): Observable<any> {
    return this.get(`${environment.apiURL}/get_due_loan_history`, filter);
  }

  uploadBatchLoan(data: any): Observable<any> {
    return this.http.post(environment.apiURL + "/upload_batch_loans", data);
  }
}
