import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { CryptoService } from "./crypto.service";
import { environment } from "src/environments/environment.development";
import { BaseApiService } from "./base-api-service";
@Injectable({
  providedIn: "root",
})
export class DashboardService extends BaseApiService {
  constructor(http: HttpClient, crypto: CryptoService) {
    super(http, crypto);
  }

  getDashboardStatistics(filter: any): Observable<any> {
    return this.get(`${environment.apiURL}/get_dashboard_statistics`, filter);
  }

  getNotifications(filter: any): Observable<any> {
    console.log("Response >>>>>>>>");
    return this.get(`${environment.apiURL}/get_notifications`, filter);
  }
}
