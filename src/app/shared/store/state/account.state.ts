import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { catchError, tap, throwError } from "rxjs";
import { GetUserDetails, UpdateUserProfile, UpdateUserPassword, AccountClear, SetUserInfo, GetPermissionsOnly } from "../action/account.action";
import { AccountUser } from "./../../interface/account.interface";

import { NotificationService } from "../../services/notification.service";
import { Permission } from "../../interface/role.interface";
import { appConfig } from "src/app/core/config/config";
import { AccountService } from "src/app/core/services/account.service";

export class AccountStateModel {
  user: any;
  permissions: any[];
  roleName: string | null;
}

@State<AccountStateModel>({
  name: "account",
  defaults: {
    user: null,
    permissions: [],
    roleName: null
  },
})
@Injectable()
export class AccountState {

  constructor(private accountService: AccountService,
      private notificationService: NotificationService, 
      public router: Router) {}

  @Selector()
  static user(state: AccountStateModel) {
    return state.user;
  }

  @Selector()
  static permissions(state: AccountStateModel) {
    return state.permissions;
  }

  @Selector()
  static getRoleName(state: AccountStateModel) {
    return state.roleName;
  }

  @Selector()
  static getUserRole(state: AccountStateModel): number {
    return state.user?.role;
  }

  @Action(SetUserInfo)
  setUserInfo(ctx: StateContext<AccountStateModel>, { payload }: SetUserInfo) {
    ctx.patchState({
      user: payload
    });
  }

@Action(GetPermissionsOnly)
getPermissionsOnly(ctx: StateContext<AccountStateModel>) {
  return this.accountService.getUserDetails().pipe(
    tap({
      next: result => {
        ctx.patchState({
          permissions: result.permission || [],
          roleName: result.role?.name || ''
        });
      },
      error: err => {
        throw new Error(err?.error?.message || 'Failed to fetch permissions');
      }
    })
  );
}


  @Action(UpdateUserProfile)
  updateProfile(ctx: StateContext<AccountStateModel>, { payload, id }: UpdateUserProfile) {
    // Update profile logic here
        
        return this.accountService.updateUserProfile(payload,id).pipe(
          tap((response: any) => {
            if (response.status === appConfig.statusCode.ok) {
              this.notificationService.showSuccess(response.message);
              const currentState = ctx.getState();
              const updatedUser = {
                ...currentState.user,
                ...payload // merge updated fields
              };
              ctx.patchState({ user: updatedUser });
            } else {
              this.notificationService.showError(response.message || 'Failed to update password');
            }
          }),
          catchError((error) => {
            const message = error?.error?.message || 'Something went wrong while updating password';
            this.notificationService.showError(message);
            return throwError(() => error);
          })
      );
  }

  @Action(UpdateUserPassword)
  updatePassword(ctx: StateContext<AccountStateModel>, { payload, id }: UpdateUserPassword) {
    // Update password logic here
        return this.accountService.updateUserPassword(payload,id).pipe(
          tap((response: any) => {
            console.log('re::',response);
            if (response.status === appConfig.statusCode.accepted) {
              this.notificationService.showSuccess(response.message);
              
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

  @Action(AccountClear)
  accountClear(ctx: StateContext<AccountStateModel>){
    ctx.patchState({
      user: null,
      permissions: [],
      roleName: null
    });
  }

}