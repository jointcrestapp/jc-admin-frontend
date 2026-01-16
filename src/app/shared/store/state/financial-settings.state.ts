import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { catchError, finalize, map, tap, throwError } from "rxjs";
import {
  addUpdateFinancialSettings,
  GetFinancialSettingsList,
  SetLoadingState,
} from "../action/financial-settings.action";
import { SettingsService } from "src/app/core/services/settings.service";


  
export interface FinancialSettingsStateModel {
  loading?: boolean;
  response?: any | null;
  financialSettings?: {
    data: any;
    total: number;
  };

}

@State<FinancialSettingsStateModel>({
  name: "financialSettings",
  defaults: {
    loading: false,
  },
})
@Injectable()
export class FinancialSettingsState {
  constructor(private settingsService: SettingsService) {}

  @Selector()
  static isLoading(state: FinancialSettingsStateModel) {
    return state.loading;
  }

// Add this to your State class
@Selector()
static financialSettings(state: FinancialSettingsStateModel) {
  return state.financialSettings?.data; 
}
  @Action(SetLoadingState)
  setLoading(
    ctx: StateContext<FinancialSettingsStateModel>,
    { isLoading }: SetLoadingState
  ) {
    ctx.patchState({ loading: isLoading });
  }

  @Action(addUpdateFinancialSettings)
  add(
    ctx: StateContext<FinancialSettingsStateModel>,
    { payload }: addUpdateFinancialSettings
  ) {
    ctx.patchState({ loading: true });
    const state = ctx.getState();

    return this.settingsService.addUpdateFinancialSettings(payload).pipe(
      tap((res: any) => {
        ctx.patchState({
          response: res,
        });
      }),
      finalize(() => ctx.patchState({ loading: false })),
      map((res: any) => res) // ✅ this returns the real API response to your component
    );
  }
  @Action(GetFinancialSettingsList)
  GetFinancialSettingsList(
    ctx: StateContext<FinancialSettingsStateModel>,
    {  }: GetFinancialSettingsList
  ) {
    ctx.patchState({ loading: true });

    return this.settingsService.getFinancialSettings().pipe(
      tap((result: any) => {
        ctx.patchState({
          financialSettings: {
            data: result?.data,
            total:
              result?.pagination?.total ||
              result?.total ||
              result?.data?.length,
          },
          loading: false,
        });
      }),
      catchError((err) => {
        ctx.patchState({ loading: false });
        console.error("Error financialSettingss:", err);
        return throwError(() => err);
      })
    );
  }
}
