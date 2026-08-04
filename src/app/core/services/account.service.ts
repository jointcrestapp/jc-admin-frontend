import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment.development";
import { AccountUser } from "../../shared/interface/account.interface"; // Adjust the import path as necessary
import { CryptoService } from '../../core//services/crypto.service';
import { BaseApiService } from './base-api-service';
@Injectable({
  providedIn: 'root'
})
export class AccountService extends BaseApiService {
  constructor(http: HttpClient, crypto: CryptoService) {
    super(http, crypto);
  }

  getUserDetails(): Observable<AccountUser> {
    return this.get<AccountUser>(`${environment.apiURL}/me`);
  }

  updateUserProfile(data: any,id:number): Observable<any> {
    return this.put(`${environment.apiURL}/update_user_profile/${id}`, data);
  }
  updateUserPassword(data: any,id:number): Observable<any> {
    return this.put(`${environment.apiURL}/change_user_password/${id}`, data);
  }
   
}
