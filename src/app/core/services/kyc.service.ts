import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CryptoService } from "../../core//services/crypto.service";
import { environment } from "src/environments/environment.development";
import { BaseApiService } from "./base-api-service";
@Injectable({
  providedIn: "root",
})
export class KYCService extends BaseApiService {
  constructor(http: HttpClient, crypto: CryptoService) {
    super(http, crypto);
  }
   getKYCSubmissions(params?: any) {
    return this.get(`${environment.apiURL}/kyc`, { params });
  }

  getOneKYC(id: number) {
    return this.get(`${environment.apiURL}/kyc/${id}`);
  }

  updateKYCStatus(id: number, payload: any) {
    return this.put(`${environment.apiURL}/kyc/${id}`, payload);
  }

  deleteKYC(id: number) {
    
    return this.delete(`${environment.apiURL}/kyc/${id}`);
  }
}
