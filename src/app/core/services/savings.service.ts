import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { CryptoService } from "../../core//services/crypto.service";
import { environment } from "src/environments/environment.development";
import { BaseApiService } from "./base-api-service";
@Injectable({
  providedIn: "root",
})
export class SavingsService extends BaseApiService {
  constructor(http: HttpClient, crypto: CryptoService) {
    super(http, crypto);
  }

  getSavings(filter: any): Observable<any> {
    return this.get(`${environment.apiURL}/get_savings_history`, filter);
  }

  addSavings(data: any): Observable<any> {
    return this.post(`${environment.apiURL}/add_savings`, data);
  }

  getSavingsById(id: string): Observable<any> {
    return this.get(`${environment.apiURL}/get_savings_by_id/${id}`);
  }

  getFilteredMember(filter: any): Observable<any> {
    return this.get(`${environment.apiURL}/get_filtered_members`, filter);
  }

  updateSavings(data: any, id: number): Observable<any> {
    return this.put(`${environment.apiURL}/update_savings/${id}`, data);
  }
  updateUserSavingsStatus(data: any): Observable<any> {
    return this.post(`${environment.apiURL}/update_savings_status`, data);
  }

  deleteSavings(id: number): Observable<any> {
    return this.delete(`${environment.apiURL}/delete_saving/${id}`);
  }

  searchForSavings(data: any): Observable<any> {
    return this.http.post(environment.apiURL + "/search_for_savings", data);
  }

  uploadBatchSavings(data: any): Observable<any> {
    return this.http.post(environment.apiURL + "/upload_batch_savings", data);
  }
  getCurrencies(filter: any): Observable<any> {
    return this.get(`${environment.apiURL}/get_currencies`, filter);
  }

  deleteCurrency(id: number): Observable<any> {
    return this.delete(`${environment.apiURL}/delete_currency/${id}`);
  }

  addCurrency(data: any): Observable<any> {
    return this.post(`${environment.apiURL}/add_currency`, data);
  }

  updateCurrency(data: any, id: number): Observable<any> {
    return this.put(`${environment.apiURL}/update_currency/${id}`, data);
  }
}
