import { Injectable } from "@angular/core";
import { Store, Action, Selector, State, StateContext } from "@ngxs/store";
import { catchError, finalize, map, tap, throwError } from "rxjs";
import {
  GetFilteredMembers,
  GetDividends,
  SetLoadingState,
  CreateDividend,
} from "../action/dividend.action";
import { DividendService } from "src/app/core/services/dividend.service";
import { NotificationService } from "../../services/notification.service";

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
    private dividendService: DividendService
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
        const state = ctx.getState();
        ctx.patchState({
          dividend: {
            data: [...state.dividend.data, res.data],
            total: state.dividend.total + 1,
          },
          response: res,
        });
      }),
      finalize(() => ctx.patchState({ loading: false })),
      map((res: any) => res) // ✅ this returns the real API response to your component
    );
  }
}
