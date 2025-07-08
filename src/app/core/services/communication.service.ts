import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { CryptoService } from "../../core//services/crypto.service";
import { environment } from "src/environments/environment.development";
import { BaseApiService } from "./base-api-service";
@Injectable({
  providedIn: "root",
})
export class COmmunicationService extends BaseApiService {
  constructor(http: HttpClient, crypto: CryptoService) {
    super(http, crypto);
  }

  sendMessage(data: any): Observable<any> {
    return this.post(`${environment.apiURL}/send_messages`, data);
  }

  sendSms(data: any): Observable<any> {
    return this.post(`${environment.apiURL}/send_sms`, data);
  }
}
