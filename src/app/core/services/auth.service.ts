import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from './../../../environments/environment.development';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { CryptoService } from './crypto.service'; // assuming path
import { appConfig } from '../config/config';
import { BaseApiService } from './base-api-service';
import { Logout } from 'src/app/shared/store/action/auth.action';
import { LoginSuccess } from 'src/app/shared/store/action/user.action';
import { NotificationService } from 'src/app/shared/services/notification.service';


@Injectable({
  providedIn: 'root',
})
export class AuthService extends BaseApiService {
  onLoggedOut: EventEmitter<boolean> = new EventEmitter();
  onLoggedIn: EventEmitter<boolean> = new EventEmitter();

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
    return this.http.post(`${environment.apiURL}/signup`, data);
  }

  login(data: any): Observable<any> {
    return this.http.post(`${environment.apiURL}/login`, data).pipe(
      map((response: any) => {
        const { access, data: user } = response;
        if (access && user) {
          this.store.dispatch(new LoginSuccess({ token: access, user }));
          this.onLoggedIn.emit(true);
        }
        return response;
      })
    );
  }

  logOutRequest(data: any): Observable<any> {
    return this.http.post(`${environment.apiURL}/logout`, data).pipe(
      map((response: any) => {
        if (response.status === appConfig.statusCode.ok) {
          this.logoutUser();
        } else {
          this.notificationService.showError(response.message);
        }
        return response;
      })
    );
  }

  logoutUser() {
    this.store.dispatch(new Logout());
    this.onLoggedOut.emit(true);
    this.router.navigate(['login']);
  }

  getToken(): string | null {
    return this.store.selectSnapshot((state: any) => state.user.token);
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
}
