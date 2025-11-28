import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { CryptoService } from "../../core//services/crypto.service";
import { environment } from "src/environments/environment.development";
import { BaseApiService } from "./base-api-service";
import { Params } from "src/app/shared/interface/core.interface";
@Injectable({
  providedIn: "root",
})
export class MemberService extends BaseApiService {
  constructor(http: HttpClient, crypto: CryptoService) {
    super(http, crypto);
  }

  getMembers(filter: any): Observable<any> {
    return this.get(`${environment.apiURL}/get_members`, filter);
  }

  getAgents(filter: any): Observable<any> {
    return this.get(`${environment.apiURL}/get_agents`, filter);
  }

  getPendingMembers(filter: any): Observable<any> {
    return this.get(`${environment.apiURL}/get_pending_members`, filter);
  }

  getExitedMembers(filter: any): Observable<any> {
    return this.get(`${environment.apiURL}/get_exited_members`, filter);
  }

  getAccountRequestClosure(filter: any): Observable<any> {
    return this.get(
      `${environment.apiURL}/get_request_closure_members`,
      filter
    );
  }

  getNotifications(data: any): Observable<any> {
    return this.get(`${environment.apiURL}/get_notifications`, data);
  }

  addMember(data: any): Observable<any> {
    return this.post(`${environment.apiURL}/add_member`, data);
  }

  getMemberById(id: string): Observable<any> {
    return this.get(`${environment.apiURL}/member/${id}`);
  }

  updateMember(data: any, id: number): Observable<any> {
    return this.put(`${environment.apiURL}/update_member/${id}`, data);
  }

  updateMemberStatus(data: any, id: number): Observable<any> {
    return this.patch(`${environment.apiURL}/update_member_status/${id}`, data);
  }

  reactivateMember(data: any, id: number): Observable<any> {
    return this.patch(`${environment.apiURL}/reactivate_member/${id}`, data);
  }

  updateDeleteStatus(data: any, id: number): Observable<any> {
    return this.patch(`${environment.apiURL}/update_delete_status/${id}`, data);
  }
  deleteMember(id: number): Observable<any> {
    return this.delete(`${environment.apiURL}/delete_member/${id}`);
  }

  deleteMultipleMembers(data: any): Observable<any> {
    return this.post(`${environment.apiURL}/delete_multiple_members`, data);
  }

  getSubscription(data: any): Observable<any> {
    return this.post(environment.apiURL + "/get_subscription_history", data);
  }

  saveEmailOTP(data: any): Observable<any> {
    return this.post(environment.apiURL + "/save_email_otp", data);
  }
  savePasswordResetOTP(data: any): Observable<any> {
    return this.post(environment.apiURL + "/send_password_reset_otp", data);
  }
  verifyPasswordResetOTP(data: any): Observable<any> {
    return this.post(environment.apiURL + "/verify_password_reset_otp", data);
  }

  getNigerianBanks(): Observable<any> {
    return this.http.get("https://nigerianbanks.xyz/");
  }

  getKYC(data: any): Observable<any> {
    return this.post(environment.apiURL + "/get_kyc", data);
  }

  resetMemberPassword(data: any): Observable<any> {
    return this.post(environment.apiURL + "/reset_user_password", data);
  }

  updateMemberPassword(data: any): Observable<any> {
    return this.post(environment.apiURL + "/change_member_password", data);
  }

  verifyEmailOTP(data: any): Observable<any> {
    return this.post(environment.apiURL + "/verify_email_otp", data);
  }

  updatePhoneNumber(data: any): Observable<any> {
    return this.post(environment.apiURL + "/update_phone", data);
  }
  updateUsername(data: any): Observable<any> {
    return this.post(environment.apiURL + "/update_username", data);
  }
  updateLocation(data: any): Observable<any> {
    return this.post(environment.apiURL + "/update_location", data);
  }
  updateProfileEmail(data: any): Observable<any> {
    return this.post(environment.apiURL + "/update_profile_email", data);
  }

  deleteAccount(data: any): Observable<any> {
    return this.post(environment.apiURL + "/delete_account", data);
  }
  updateBio(data: any): Observable<any> {
    return this.post(environment.apiURL + "/update_bio", data);
  }

  getUserProfile(data: any): Observable<any> {
    return this.post(environment.apiURL + "/get_user_profile", data);
  }

  searchForUsers(data: any): Observable<any> {
    return this.post(environment.apiURL + "/search_for_users", data);
  }

  getStatisticsCount(payload?: Params): Observable<any> {
    return this.http.get<any>(`${environment.URL}/count.json`, {
      params: payload,
    });
  }

  exportMembers(filter?: any): Observable<any> {
    return this.get(`${environment.apiURL}/export_members`, filter);
  }

  //KYC
   getKYCSubmissions(params?: any) {
    return this.http.get(`${environment.apiURL}/kyc`, { params });
  }

  getOneKYC(id: number) {
    return this.http.get(`${environment.apiURL}/kyc/${id}`);
  }

  updateKYCStatus(id: number, payload: any) {
    return this.http.put(`${environment.apiURL}/kyc/${id}`, payload);
  }

  deleteKYC(id: number) {
    return this.http.delete(`${environment.apiURL}/kyc/${id}`);
  }
}
