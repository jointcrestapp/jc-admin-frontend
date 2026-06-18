import { Injectable } from "@angular/core";
import { Store, Action, Selector, State, StateContext } from "@ngxs/store";
import { catchError, finalize, map, tap, throwError } from "rxjs";
import {
  GetFilteredMembers,
  GetDividends,
  SetLoadingState,
  CreateDividend,
  ExportDividends,
  GetMonthlyProfits,
  AddMonthlyProfit,
  DeleteMonthlyProfit,
} from "../action/dividend.action";
import { DividendService } from "src/app/core/services/dividend.service";
import { NotificationService } from "../../services/notification.service";
import { DividendExcelService } from "src/app/core/services/dividend-export.service";

export interface DividendStateModel {
  dividend: { data: any[]; total: any | null };
  monthlyProfits: { data: any[]; total: number; yearly_total: number };
  loading?: boolean;
  selectedDividend?: any | null;
  response?: any | null;
  member?: any | null;
}

@State<DividendStateModel>({
  name: "dividend",
  defaults: {
    dividend: { data: [], total: 0 },
    monthlyProfits: { data: [], total: 0, yearly_total: 0 },
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
  static monthlyProfits(state: DividendStateModel) {
    return state.monthlyProfits;
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
  setLoading(ctx: StateContext<DividendStateModel>, { isLoading }: SetLoadingState) {
    ctx.patchState({ loading: isLoading });
  }

  @Action(GetDividends)
  getDividends(ctx: StateContext<DividendStateModel>, { payload }: GetDividends) {
    ctx.patchState({ loading: true });
    return this.dividendService.getDividend(payload).pipe(
      tap((result: any) => {
        ctx.patchState({
          dividend: {
            data: result?.data || [],
            total: result?.pagination?.total || result?.data?.length || 0,
          },
          loading: false,
        });
      }),
      catchError((err) => {
        ctx.patchState({ loading: false });
        return throwError(() => err);
      })
    );
  }

  @Action(GetFilteredMembers)
  getFilteredMembers(ctx: StateContext<DividendStateModel>, { payload }: GetFilteredMembers) {
    ctx.patchState({ loading: true });
    return this.dividendService.getFilteredMember(payload).pipe(
      tap((result: any) => {
        ctx.patchState({ member: result?.data, loading: false });
      }),
      catchError((err) => {
        ctx.patchState({ loading: false });
        return throwError(() => err);
      })
    );
  }

  @Action(CreateDividend)
  create(ctx: StateContext<DividendStateModel>, { payload }: CreateDividend) {
    ctx.patchState({ loading: true });
    return this.dividendService.addDividend(payload).pipe(
      tap((res: any) => {
        ctx.patchState({ response: res });
      }),
      finalize(() => ctx.patchState({ loading: false })),
      map((res: any) => res)
    );
  }

  @Action(GetMonthlyProfits)
  getMonthlyProfits(ctx: StateContext<DividendStateModel>, { payload }: GetMonthlyProfits) {
    ctx.patchState({ loading: true });
    return this.dividendService.getMonthlyProfits(payload).pipe(
      tap((result: any) => {
        ctx.patchState({
          monthlyProfits: {
            data: result?.data || [],
            total: result?.pagination?.total || result?.data?.length || 0,
            yearly_total: result?.yearly_total || 0,
          },
          loading: false,
        });
      }),
      catchError((err) => {
        ctx.patchState({ loading: false });
        return throwError(() => err);
      })
    );
  }

  @Action(AddMonthlyProfit)
  addMonthlyProfit(ctx: StateContext<DividendStateModel>, { payload }: AddMonthlyProfit) {
    ctx.patchState({ loading: true });
    return this.dividendService.addMonthlyProfit(payload).pipe(
      tap((res: any) => {
        ctx.patchState({ response: res });
      }),
      finalize(() => ctx.patchState({ loading: false })),
      map((res: any) => res)
    );
  }

  @Action(DeleteMonthlyProfit)
  deleteMonthlyProfit(ctx: StateContext<DividendStateModel>, { id }: DeleteMonthlyProfit) {
    ctx.patchState({ loading: true });
    return this.dividendService.deleteMonthlyProfit(id).pipe(
      tap((res: any) => {
        ctx.patchState({ response: res });
      }),
      finalize(() => ctx.patchState({ loading: false })),
      map((res: any) => res)
    );
  }

  @Action(ExportDividends)
  export(ctx: StateContext<DividendStateModel>, { customData }: ExportDividends) {
    const state = ctx.getState();
    ctx.patchState({ loading: true });
    const dividendsToExport = (customData?.length ? customData : state.dividend.data) || [];
    if (!dividendsToExport.length) {
      ctx.patchState({ loading: false });
      this.notificationService.showError('No dividend data available to export');
      return;
    }
    return this.dividendExcelService.exportDividendToExcel(dividendsToExport).pipe(
      tap(() => ctx.patchState({ loading: false })),
      catchError((err) => {
        ctx.patchState({ loading: false });
        return throwError(() => err);
      })
    );
  }
}
