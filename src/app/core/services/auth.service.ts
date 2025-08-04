import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from './../../../environments/environment.development';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { CryptoService } from './crypto.service'; // assuming path
import { appConfig } from '../config/config';
import { BaseApiService } from './base-api-service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { AuthState } from 'src/app/shared/store/state/auth.state';


@Injectable({
  providedIn: 'root',
})
export class AuthService extends BaseApiService {

  constructor(
    http: HttpClient,
    crypto: CryptoService,
    private notificationService : NotificationService,
    private router: Router,
    private store: Store,
  ) {
      super(http, crypto);
  }

  signUp(data: any): Observable<any> {
    return this.post(`${environment.apiURL}/signup`, data);
  }

login(data:any): Observable<any> {
  return this.post(`${environment.apiURL}/login`, data);
}

logOutRequest(data: any): Observable<any> {
  return this.post(`${environment.apiURL}/logout`, data);
}

getToken(): string | null {
  return this.store.selectSnapshot(AuthState.token);
}
  
isTokenExpired(): boolean {
    const token = this.getToken();
    if (token) {
      const decoded: any = this.crypto.decodeJWT(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp <= currentTime;
    }
    return true;
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



  
  
  


  

  
  
}
