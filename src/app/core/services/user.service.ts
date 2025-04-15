import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';
import { CryptoService } from '../../core//services/crypto.service';
import { environment } from 'src/environments/environment.development';
import { BaseApiService } from './base-api-service';
@Injectable({
  providedIn: 'root',
})
export class  UserService extends BaseApiService {
  
  constructor(http: HttpClient, crypto: CryptoService) {
    super(http, crypto);
  }

  getUsers(filter: any) : Observable<any>{
    return this.post(`${environment.apiURL}/get_users`, filter);
  }
  
  getNotifications(data: any): Observable<any> {
    return this.get(`${environment.apiURL}/get_notifications`, data); 
  }

  addUser(data: any) : Observable<any> {
    return this.post(`${environment.apiURL}/add_user`, data);
  }

  getUserById(id: string) : Observable<any> {
    return this.get(`${environment.apiURL}/user/${id}`);
  }

  updateUser(data: any) : Observable<any> {
    return this.post(`${environment.apiURL}/update_user`, data);
  }
  updateUserStatus(data: any) : Observable<any> {
    return this.post(`${environment.apiURL}/update_user_status`, data);
  }
  deleteUser(data: any) : Observable<any> {
    return this.post(`${environment.apiURL}/delete_user`,data);
  }

  deleteMultipleUsers(data: any) : Observable<any> {
    return this.post(`${environment.apiURL}/delete_multiple_users`,data);
  }

  getSubscription(data: any): Observable<any> {
    return this.post(environment.apiURL+ '/get_subscription_history', data)
  }

  saveEmailOTP(data: any): Observable<any> {
    
    return this.post(environment.apiURL+ '/save_email_otp', data)
  }
  savePasswordResetOTP(data: any): Observable<any> {
    return this.post(environment.apiURL+ '/send_password_reset_otp', data)
  }
  verifyPasswordResetOTP(data: any): Observable<any> {
    return this.post(environment.apiURL+ '/verify_password_reset_otp', data)
  }
  
  resetUserPassword(data: any): Observable<any> {
    return this.post(environment.apiURL+ '/reset_user_password', data)
  }


  updateUserPassword(data: any): Observable<any> {
    return this.post(environment.apiURL+ '/change_user_password', data)
  }

 verifyEmailOTP(data: any): Observable<any> {
    return this.post(environment.apiURL+ '/verify_email_otp', data)
  }

  updatePhoneNumber(data: any): Observable<any> {
    return this.post(environment.apiURL+ '/update_phone', data)
  }
  updateUsername(data: any): Observable<any> {
    return this.post(environment.apiURL+ '/update_username', data)
  }
  updateLocation(data: any): Observable<any> {
    return this.post(environment.apiURL+ '/update_location', data)
  }
  updateProfileEmail(data: any): Observable<any> {
    return this.post(environment.apiURL+ '/update_profile_email', data)
  }

  deleteAccount(data: any): Observable<any> {
    return this.post(environment.apiURL+ '/delete_account', data)
  }
  updateBio(data: any): Observable<any> {
    return this.post(environment.apiURL+ '/update_bio', data)
  }

  getUserProfile(data: any): Observable<any> {
    return this.post(environment.apiURL+ '/get_user_profile', data)
  }

  searchForUsers(data: any): Observable<any> {
    return this.post(environment.apiURL+ '/search_for_users', data)
  }

}
