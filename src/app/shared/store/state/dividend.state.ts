import { Injectable } from "@angular/core";
import { Store, Action, Selector, State, StateContext } from "@ngxs/store";
import { catchError, finalize, map, tap, throwError } from "rxjs";
import {
  GetFilteredMembers,
  GetDividends,
  SetLoadingState,
  CreateDividend,
  ExportDividends,
} from "../action/dividend.action";
import { DividendService } from "src/app/core/services/dividend.service";
import { NotificationService } from "../../services/notification.service";
import { DividendExcelService } from "src/app/core/services/dividend-export.service";

export interface DividendStateModel {
  dividend: {
    data: any[];
    total: any | null;
  };
  loading?: boolean;
  selectedDividend?: any | null;
  response?: any | null;
  member?: any | null;
}

@State<DividendStateModel>({
  name: "dividend",
  defaults: {
    dividend: {
      data: [],
      total: 0,
    },
    loading: false,
    response: null,
    selectedDividend: null,
    member: null,
  },
})
@Injectable()
export class DividendState {
  constructor(
    private store: Store,
    private notificationService: NotificationService,
    private dividendService: DividendService,
    private dividendExcelService: DividendExcelService
  ) {}

  @Selector()
  static isLoading(state: DividendStateModel) {
    return state.loading;
  }

  @Selector()
  static dividend(state: DividendStateModel) {
    return state.dividend;
  }

  @Selector()
  static member(state: DividendStateModel) {
    return state.member;
  }

  @Selector()
  static selectedSavings(state: DividendStateModel) {
    return state.selectedDividend;
  }

  @Action(SetLoadingState)
  setLoading(
    ctx: StateContext<DividendStateModel>,
    { isLoading }: SetLoadingState
  ) {
    ctx.patchState({ loading: isLoading });
  }

  @Action(GetDividends)
  getWithdrawal(
    ctx: StateContext<DividendStateModel>,
    { payload }: GetDividends
  ) {
    ctx.patchState({ loading: true });

    return this.dividendService.getDividend(payload).pipe(
      tap((result: any) => {
        ctx.patchState({
          dividend: {
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
        console.error("Error fetching dividend:", err);
        return throwError(() => err);
      })
    );
  }

  @Action(GetFilteredMembers)
  getFilteredMembers(
    ctx: StateContext<DividendStateModel>,
    { payload }: GetFilteredMembers
  ) {
    const state = ctx.getState();
    ctx.patchState({ loading: true });

    return this.dividendService.getFilteredMember(payload).pipe(
      tap((result: any) => {
        ctx.patchState({
          member: result?.data,
          loading: false,
        });
      }),
      catchError((err) => {
        ctx.patchState({ loading: false });
        console.error("Error fetching members:", err);
        return throwError(() => err);
      })
    );
  }

  @Action(CreateDividend)
  create(ctx: StateContext<DividendStateModel>, { payload }: CreateDividend) {
    ctx.patchState({ loading: true });
    return this.dividendService.addDividend(payload).pipe(
      tap((res: any) => {
        ctx.patchState({
          response: res,
        });
      }),
      finalize(() => ctx.patchState({ loading: false })),
      map((res: any) => res) // ✅ this returns the real API response to your component
    );
  }

  @Action(ExportDividends)
  export(
    ctx: StateContext<DividendStateModel>,
    { customData }: ExportDividends
  ) {
    const state = ctx.getState();
    ctx.patchState({ loading: true });

    let dividendsToExport: any[] = [];

    if (customData && customData.length > 0) {
      dividendsToExport = customData;
    } else {
      dividendsToExport = state.dividend.data;
    }

    if (!dividendsToExport || dividendsToExport.length === 0) {
      ctx.patchState({ loading: false });
      this.notificationService.showError(
        `No Dividend Historry data available to export`
      );
      return;
    }

    return this.dividendExcelService
      .exportDividendToExcel(dividendsToExport)
      .pipe(
        tap(() => {
          ctx.patchState({ loading: false });
        }),
        catchError((err) => {
          ctx.patchState({ loading: false });
          console.error("Error exporting dividends:", err);
          return throwError(() => err);
        })
      );
  }
}
