import { Injectable } from "@angular/core";
import { Store, State, Selector, Action, StateContext } from "@ngxs/store";
import { Router } from '@angular/router';
import { catchError, tap } from "rxjs/operators";
import { ForgotPassWord, Login, VerifyEmailOtp, UpdatePassword, Logout, AuthClear, LoginSuccess, SetToken, ClearToken, ForgotPasswordSuccess, ForgotPasswordFailed, VerifyEmailOtpSuccess, VerifyEmailOtpFailed } from "../action/auth.action";
import { AccountClear, GetPermissionsOnly, GetUserDetails, SetUserInfo } from "../action/account.action";
import { GetBadges } from "../action/sidebar.action";
import { GetSettingOption, SettingClear } from "../action/setting.action";
import { GetNotification, NotificationClear } from "../action/notification.action";
import { NotificationService } from "../../services/notification.service";
import { AuthService } from "src/app/core/services/auth.service";
import { appConfig } from "src/app/core/config/config";
import { throwError } from "rxjs";
import { DashboardClear } from "../action/dashboard.action";
import { AccountState } from "./account.state";


export interface AuthStateModel {
  id:number,
  email: string;
  token: string | null;
  expiry: number | null;  // Store the expiry time
  permissions: []; // This can remain as is, or be adjusted as needed
}


@State<AuthStateModel>({
  name: 'auth',
  defaults: {
    id: null,
    email: '',    
    token: null, // Store the access token (JWT or whatever)
    expiry: null,       // Add expiry time for the token
    permissions: [],    // Store any permissions or roles as needed
  },
})
@Injectable()
export class AuthState {

  private inactivityTimer: any;
  
  constructor(private store: Store,
    public router: Router,
    private notify: NotificationService,
    private notificationService: NotificationService,
    private authService: AuthService) { }

  @Selector()
  static accessToken(state: AuthStateModel) {
    return state.token;
  }

  @Selector()
  static isAuthenticated(state: AuthStateModel) {
    return !!state.token;
  }

  @Selector()
  static email(state: AuthStateModel) {
    return state.email;
  }

  @Selector()
  static id(state: AuthStateModel) {
    return state.id;
  }

  @Selector()
  static token(state: AuthStateModel) {
    return state.token;
  }

  @Selector()
  static expiry(state: AuthStateModel) {
    return state.expiry;
  }

@Action(Login)
login(ctx: StateContext<AuthStateModel>, { payload }: Login) {
  

  return this.authService.login(payload).pipe(
    tap((response) => {
      
      
      if (response.status == appConfig.statusCode.found) {
        const { token, expiry, data: user } = response;
        user.role_name = user.role.id === 1 ? 'Super Admin' : user.role.id === 2 ? 'Admin' : '';
        user.name = user.fname + ' ' + user.lname;
        console.log('Data::',user);
          // Patch state with login details
        ctx.patchState({
            id:user.id,
            email: user.email,
            token,
            permissions: user.permissions || [],
          });

          // Dispatch token set action if expiry is to be stored
          this.store.dispatch(new SetToken({ token, expiry }));

          // Dispatch other required actions post-login
        this.store.dispatch([

            new SetUserInfo(user), // Set real user data from login
            new GetPermissionsOnly(), // Only permissions from self.json
            new GetBadges(),
            new GetNotification(),
            new GetSettingOption(),
            new LoginSuccess({ token, expiry, user })
          ]);

          this.router.navigate(['/dashboard']); 
      } else { 
          this.notificationService.showError(response?.message);    
      }
    }),
    catchError((err) => {
      this.notificationService.showError(err?.error?.message || 'Login failed');
      return throwError(() => err);
    })
  );
}

@Action(ForgotPassWord)
forgotPassword(ctx: StateContext<AuthStateModel>, { payload }: ForgotPassWord) {
  
  return this.authService.savePasswordResetOTP(payload).pipe(
    tap((response:any) => {
      if (response.status === appConfig.statusCode.created) {
        this.notificationService.showSuccess(response.message);
        ctx.patchState({
          email: response.data.email,
          token: response.data.token
        });
        this.store.dispatch(new ForgotPasswordSuccess(response));

        this.router.navigate([`/auth/otp/${response.data.token}`]); 
      } else {
        this.notificationService.showError(response.message);
        this.store.dispatch(new ForgotPasswordFailed(response));
      }
    }),
    catchError((error) => {
      const message = error?.error?.message || 'An error occurred while sending reset link.';
      this.notificationService.showError(message);
      this.store.dispatch(new ForgotPasswordFailed(error));
      return throwError(() => error);
    })
  );
}

  @Action(VerifyEmailOtp)
verifyEmailOtp(ctx: StateContext<AuthStateModel>, { payload }: VerifyEmailOtp) {
  
  return this.authService.verifyPasswordResetOTP(payload).pipe(
    tap((response: any) => {
      if (response.status === appConfig.statusCode.accepted) {
        this.notificationService.showSuccess('Email verified successfully');
        // Optionally patch state or dispatch a success action
        this.store.dispatch(new VerifyEmailOtpSuccess(response.data));
        this.router.navigateByUrl('/auth/update-password');
      } else {
        this.notificationService.showError(response.message || 'OTP verification failed');
        this.store.dispatch(new VerifyEmailOtpFailed(response));
      }
    }),
    catchError((error) => {
      const message = error?.error?.message || 'An error occurred during OTP verification';
      this.notificationService.showError(message);
      this.store.dispatch(new VerifyEmailOtpFailed(error));
      return throwError(() => error);
    })
  );
}


  @Action(UpdatePassword)
updatePassword(ctx: StateContext<AuthStateModel>, { payload }: UpdatePassword) {
  

  return this.authService.resetUserPassword(payload).pipe(
    tap((response: any) => {
      if (response.status === appConfig.statusCode.ok) {
        this.notificationService.showSuccess(response.message);
        this.router.navigate(['/auth/login']);
      } else {
        this.notificationService.showError(response.message);
      }
    }),
    catchError((error) => {
      const message = error?.error?.message || 'Something went wrong while updating password';
      this.notificationService.showError(message);
      return throwError(() => error);
    })
  );
}


@Action(Logout)
logout(ctx: StateContext<AuthStateModel>) {
  const state = ctx.getState();
  const user = this.store.selectSnapshot(AccountState.user); // snapshot of AccountState
  
  const logData = {
    action: 'logout',
    user_id: user?.id,
    user_role_id: user?.role,
    email: state.email,
    access_token: state.token
  };

  return this.authService.logOutRequest(logData).pipe(
    tap((response) => {
      if (response.status === appConfig.statusCode.ok) {
        // Reset auth state
        ctx.patchState({
          email: '',
          token: '',
          permissions: [],
        });

        // Dispatch additional state clears
        this.store.dispatch(new AuthClear());
        this.store.dispatch(new AccountClear());
        this.store.dispatch(new ClearToken()); // Clear token and expiry from the state

        // Redirect
        this.router.navigate(['/auth/login']);
      } else {
        this.notificationService.showError(response.message || 'Logout failed.');
      }
    }),
    catchError(err => {
      this.notificationService.showError(err?.error?.message || 'Logout failed due to a network error.');
      return throwError(() => err);
    })
  );
}

 // Action to set token and expiry
  @Action(SetToken)
  setToken(ctx: StateContext<AuthStateModel>, action: SetToken) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      token: action.payload.token,
      expiry: action.payload.expiry, // Store expiry time here
    });
  }

  // Action to clear token and expiry
 @Action(ClearToken)
  clearToken(ctx: StateContext<AuthStateModel>) {
    ctx.setState({
      ...ctx.getState(),
      token: null,
      expiry: null,  // Clear expiry as well
      permissions: [],
    });

    // Redirect the user to login page after logout
    this.router.navigate(['/auth/login']);
  }

@Action(AuthClear)
  authClear(ctx: StateContext<AuthStateModel>){
    ctx.patchState({
      email: '',
      token: null,
      permissions: [],
    });
  this.store.dispatch([
    new AccountClear(),
    new DashboardClear(),
    new NotificationClear(),
    new SettingClear()
  ])
  }

}
