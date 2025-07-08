import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { catchError, finalize, map, tap, throwError } from "rxjs";
import {
  SetLoadingState,
  CreateCooperative,
  CreateLoanApplicationConfiguration,
  CreateNotificationConfiguration,
  CreateMemberManagementSettings,
  CreatePaymentGatewayConfiguration,
} from "../action/settings.action";
import { SettingsService } from "../../../core/services/settings.service";

export interface SettingsStateModel {
  loading?: boolean;
  response?: any | null;
}

@State<SettingsStateModel>({
  name: "settings",
  defaults: {
    loading: false,
  },
})
@Injectable()
export class SettingsState {
  constructor(private settingsService: SettingsService) {}

  @Selector()
  static isLoading(state: SettingsStateModel) {
    return state.loading;
  }

  @Action(SetLoadingState)
  setLoading(
    ctx: StateContext<SettingsStateModel>,
    { isLoading }: SetLoadingState
  ) {
    ctx.patchState({ loading: isLoading });
  }

  @Action(CreateCooperative)
  createCooperative(
    ctx: StateContext<SettingsStateModel>,
    { payload }: CreateCooperative
  ) {
    ctx.patchState({ loading: true });
    const state = ctx.getState();

    return this.settingsService.addCooperative(payload).pipe(
      tap((res: any) => {
        ctx.patchState({
          response: res,
        });
      }),
      finalize(() => ctx.patchState({ loading: false })),
      map((res: any) => res) // ✅ this returns the real API response to your component
    );
  }

  @Action(CreateLoanApplicationConfiguration)
  createLoan(
    ctx: StateContext<SettingsStateModel>,
    { payload }: CreateLoanApplicationConfiguration
  ) {
    ctx.patchState({ loading: true });
    const state = ctx.getState();

    return this.settingsService.addLoanApplicationConfiguration(payload).pipe(
      tap((res: any) => {
        ctx.patchState({
          response: res,
        });
      }),
      finalize(() => ctx.patchState({ loading: false })),
      map((res: any) => res) // ✅ this returns the real API response to your component
    );
  }

  @Action(CreateNotificationConfiguration)
  createNotification(
    ctx: StateContext<SettingsStateModel>,
    { payload }: CreateNotificationConfiguration
  ) {
    ctx.patchState({ loading: true });
    const state = ctx.getState();

    return this.settingsService.addNotificationConfiguration(payload).pipe(
      tap((res: any) => {
        ctx.patchState({
          response: res,
        });
      }),
      finalize(() => ctx.patchState({ loading: false })),
      map((res: any) => res) // ✅ this returns the real API response to your component
    );
  }

  @Action(CreateMemberManagementSettings)
  createMember(
    ctx: StateContext<SettingsStateModel>,
    { payload }: CreateMemberManagementSettings
  ) {
    ctx.patchState({ loading: true });
    const state = ctx.getState();

    return this.settingsService.addMemberManagementSettings(payload).pipe(
      tap((res: any) => {
        ctx.patchState({
          response: res,
        });
      }),
      finalize(() => ctx.patchState({ loading: false })),
      map((res: any) => res) // ✅ this returns the real API response to your component
    );
  }

  @Action(CreatePaymentGatewayConfiguration)
  createPayment(
    ctx: StateContext<SettingsStateModel>,
    { payload }: CreatePaymentGatewayConfiguration
  ) {
    ctx.patchState({ loading: true });
    const state = ctx.getState();

    return this.settingsService.addPaymentGatewayConfiguration(payload).pipe(
      tap((res: any) => {
        ctx.patchState({
          response: res,
        });
      }),
      finalize(() => ctx.patchState({ loading: false })),
      map((res: any) => res) // ✅ this returns the real API response to your component
    );
  }
}
