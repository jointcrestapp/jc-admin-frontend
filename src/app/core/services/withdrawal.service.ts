import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { CryptoService } from "../../core//services/crypto.service";
import { environment } from "src/environments/environment.development";
import { BaseApiService } from "./base-api-service";
@Injectable({
  providedIn: "root",
})
export class WithdrawalService extends BaseApiService {
  constructor(http: HttpClient, crypto: CryptoService) {
    super(http, crypto);
  }

  getWithdrawal(filter: any): Observable<any> {
    return this.get(`${environment.apiURL}/get_withdrawal_history`, filter);
  }

  getPendingWithdrawal(filter: any): Observable<any> {
    return this.get(
      `${environment.apiURL}/get_pending_withdrawal_history`,
      filter
    );
  }

  getFilteredMember(filter: any): Observable<any> {
    return this.get(`${environment.apiURL}/get_filtered_members`, filter);
  }

  addWithdrawalRequest(data: any): Observable<any> {
    return this.post(`${environment.apiURL}/add_withdrawal_request`, data);
  }

  // getSavingsById(id: string) : Observable<any> {
  //   return this.get(`${environment.apiURL}/get_savings_by_id/${id}`);
  // }

  // getFilteredMember(filter: any) : Observable<any> {
  //   return this.get(`${environment.apiURL}/get_filtered_members`, filter);
  // }

  updateWithdrawalRequest(data: any, id: number): Observable<any> {
    return this.put(
      `${environment.apiURL}/update_withdrawal_request/${id}`,
      data
    );
  }
  // updateUserSavingsStatus(data: any) : Observable<any> {
  //   return this.post(`${environment.apiURL}/update_savings_status`, data);
  // }

  // deleteSavings(id:number) : Observable<any> {
  //   return this.delete(`${environment.apiURL}/delete_saving/${id}`);
  // }

  // searchForSavings(data: any): Observable<any> {
  //   return this.http.post(environment.apiURL+ '/search_for_savings', data)
  // }

  // uploadBatchSavings(data: any): Observable<any> {
  //   return this.http.post(environment.apiURL+ '/upload_batch_savings', data)
  // }
}
