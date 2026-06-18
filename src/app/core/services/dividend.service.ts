import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { CryptoService } from "../../core//services/crypto.service";
import { environment } from "src/environments/environment.development";
import { BaseApiService } from "./base-api-service";
@Injectable({
  providedIn: "root",
})
export class DividendService extends BaseApiService {
  constructor(http: HttpClient, crypto: CryptoService) {
    super(http, crypto);
  }

  getDividend(filter: any): Observable<any> {
    return this.get(`${environment.apiURL}/get_dividend_history`, filter);
  }

  getFilteredMember(filter: any): Observable<any> {
    return this.get(`${environment.apiURL}/get_filtered_members`, filter);
  }

  addDividend(data: any): Observable<any> {
    return this.post(`${environment.apiURL}/calculate_dividends`, data);
  }

  // Monthly profits
  getMonthlyProfits(filter: any): Observable<any> {
    return this.get(`${environment.apiURL}/get_monthly_profits`, filter);
  }

  addMonthlyProfit(data: any): Observable<any> {
    return this.post(`${environment.apiURL}/add_monthly_profit`, data);
  }

  deleteMonthlyProfit(id: number): Observable<any> {
    return this.delete(`${environment.apiURL}/delete_monthly_profit/${id}`);
  }
}
