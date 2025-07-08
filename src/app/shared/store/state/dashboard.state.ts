import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { catchError, tap, throwError } from "rxjs";
import {
  GetStatisticsCount,
  GetRevenueChart,
  SetLoadingState,
} from "../action/dashboard.action";
import {
  StatisticsCount,
  RevenueChart,
} from "./../../interface/dashboard.interface";
import { DashboardService } from "../../../core/services/dashboard.service";

export interface DashboardStateModel {
  statistics: StatisticsCount | null;
  revenueChart: RevenueChart | null;
  loading?: boolean;
  recent_savings?: any[];
  recent_thrifts?: any[];
  recent_txns?: any[];
}

@State<DashboardStateModel>({
  name: "dashboard",
  defaults: {
    statistics: null,
    revenueChart: null,
    loading: false,
    recent_savings: [],
    recent_thrifts: [],
    recent_txns: [],
  },
})
@Injectable()
export class DashboardState {
  constructor(private dashboardService: DashboardService) {}

  @Selector()
  static isLoading(state: DashboardStateModel) {
    return state.loading;
  }

  @Selector()
  static statistics(state: DashboardStateModel) {
    return state.statistics;
  }

  @Selector()
  static recent_savings(state: DashboardStateModel) {
    return state.recent_savings;
  }

  @Selector()
  static recent_thrifts(state: DashboardStateModel) {
    return state.recent_thrifts;
  }

  @Selector()
  static recent_txns(state: DashboardStateModel) {
    return state.recent_txns;
  }

  @Selector()
  static revenueChart(state: DashboardStateModel) {
    return state.revenueChart;
  }

  @Action(SetLoadingState)
  setLoading(
    ctx: StateContext<DashboardStateModel>,
    { isLoading }: SetLoadingState
  ) {
    ctx.patchState({ loading: isLoading });
  }

  @Action(GetStatisticsCount)
  getStatisticsCount(
    ctx: StateContext<DashboardStateModel>,
    action: GetStatisticsCount
  ) {
    return this.dashboardService.getDashboardStatistics(action.payload).pipe(
      tap((result: any) => {
        ctx.patchState({
          statistics: result.data,
          recent_savings: result.data.recent_savings,
          recent_thrifts: result.data.recent_thrifts,
          recent_txns: result.data.recent_txns,
          loading: false,
        });
      }),
      catchError((err) => {
        ctx.patchState({ loading: false });
        console.error("Error fetching statistics:", err);
        return throwError(() => err);
      })
    );
  }

  // @Action(GetRevenueChart)
  // getRevenueChart(ctx: StateContext<DashboardStateModel>) {
  //   return this.dashboardService.getRevenueChart().pipe(
  //     tap({
  //       next: (result) => {
  //         ctx.patchState({
  //           revenueChart: result,
  //         });
  //       },
  //       error: (err) => {
  //         throw new Error(err?.error?.message);
  //       },
  //     })
  //   );
  // }
}
