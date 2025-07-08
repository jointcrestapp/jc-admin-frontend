import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { CryptoService } from "./crypto.service";
import { environment } from "src/environments/environment.development";
import { BaseApiService } from "./base-api-service";
@Injectable({
  providedIn: "root",
})
export class SettingsService extends BaseApiService {
  constructor(http: HttpClient, crypto: CryptoService) {
    super(http, crypto);
  }

  addCooperative(data: any): Observable<any> {
    return this.post(`${environment.apiURL}/add_cooperative_info`, data);
  }

  addLoanApplicationConfiguration(data: any): Observable<any> {
    return this.post(
      `${environment.apiURL}/add_loan_application_configuration`,
      data
    );
  }

  addNotificationConfiguration(data: any): Observable<any> {
    return this.post(
      `${environment.apiURL}/add_notification_configuration`,
      data
    );
  }

  addMemberManagementSettings(data: any): Observable<any> {
    return this.post(
      `${environment.apiURL}/add_member_management_settings`,
      data
    );
  }

  addPaymentGatewayConfiguration(data: any): Observable<any> {
    return this.post(
      `${environment.apiURL}/add_payment_gateway_configuration`,
      data
    );
  }
}
