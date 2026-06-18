import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { catchError, tap, throwError } from "rxjs";
import {
  GetStatisticsCount,
  GetRevenueChart,
  SetLoadingState,
  GetNotifications,
} from "../action/dashboard.action";
import {
  StatisticsCount,
  RevenueChart,
} from "./../../interface/dashboard.interface";
import { DashboardService } from "../../../core/services/dashboard.service";
import { Notification } from "../../interface/notification.interface";

export interface DashboardStateModel {
  statistics: StatisticsCount | null;
  revenueChart: RevenueChart | null;
  loading?: boolean;
  recent_savings?: any[];
  recent_thrifts?: any[];
  recent_txns?: any[];
  recent_loans?: any[];
  notification?: {
    data: Notification[];
    total: 0;
  };
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
    recent_loans: [],
    notification: {
      data: [],
      total: 0,
    },
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
  static recent_loans(state: DashboardStateModel) {
    return state.recent_loans;
  }

  @Selector()
  static revenueChart(state: DashboardStateModel) {
    return state.revenueChart;
  }

  @Selector()
  static notification(state: DashboardStateModel) {
    return state?.notification?.data;
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
          recent_loans: result.data.recent_loans,
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

  @Action(GetNotifications)
  getNotifications(
    ctx: StateContext<DashboardStateModel>,
    action: GetNotifications
  ) {
    return this.dashboardService.getNotifications(action.payload).pipe(
      tap((result: any) => {
        console.log("Response >>>>>>>>>>>>>>>>", result);
        ctx.patchState({
          notification: {
            data: result.data,
            total: result?.meta?.total
              ? result?.meta?.total
              : result.data.length,
          },
          loading: false,
        });
      }),
      catchError((err) => {
        ctx.patchState({ loading: false });
        console.error("Error fetching notifications:", err);
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
