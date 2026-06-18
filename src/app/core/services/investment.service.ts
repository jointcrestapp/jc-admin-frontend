import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { CryptoService } from "../../core//services/crypto.service";
import { environment } from "src/environments/environment.development";
import { BaseApiService } from "./base-api-service";
@Injectable({
  providedIn: "root",
})
export class InvestmentService extends BaseApiService {
  constructor(http: HttpClient, crypto: CryptoService) {
    super(http, crypto);
  }

  //Investment Types
  getInvestments(filter: any): Observable<any> {
    return this.get(`${environment.apiURL}/get_investments`, filter);
  }

  addInvestment(data: any): Observable<any> {
    return this.post(`${environment.apiURL}/add_investment`, data);
  }

  updateInvestment(data: any, id: number): Observable<any> {
    return this.put(`${environment.apiURL}/update_investment/${id}`, data);
  }

  deleteInvestment(id: number): Observable<any> {
    return this.delete(`${environment.apiURL}/delete_investment/${id}`);
  }

  getInvestmentHistories(filter: any): Observable<any> {
    return this.get(`${environment.apiURL}/get_investment_histories`, filter);
  }

  disburseInvestment(id: number): Observable<any> {
    return this.post(`${environment.apiURL}/disburse_investment/${id}`, {});
  }
}
