import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { catchError, tap, throwError } from "rxjs";
import { SubscriptionService } from "../../../core/services/subscription.service";
import {
  GetSubscriptionList,
  SetLoadingState,
} from "../action/subscription.action";

export interface SubscriptionStateModel {
  subscriptions: {
    data: any[];
    total: any | null;
  };
  loading?: boolean;
}

@State<SubscriptionStateModel>({
  name: "subscription",
  defaults: {
    subscriptions: {
      data: [],
      total: 0,
    },
    loading: false,
  },
})
@Injectable()
export class SubscriptionState {
  constructor(private subscriptionService: SubscriptionService) {}

  @Selector()
  static isLoading(state: SubscriptionStateModel) {
    return state.loading;
  }

  @Selector()
  static subscribeList(state: SubscriptionStateModel) {
    return state.subscriptions;
  }

  @Action(SetLoadingState)
  setLoading(
    ctx: StateContext<SubscriptionStateModel>,
    { isLoading }: SetLoadingState
  ) {
    ctx.patchState({ loading: isLoading });
  }

  @Action(GetSubscriptionList)
  orderCreditSales(
    ctx: StateContext<SubscriptionStateModel>,
    { payload }: GetSubscriptionList
  ) {
    ctx.patchState({ loading: true });

    return this.subscriptionService.subscriptions(payload).pipe(
      tap((result: any) => {
        ctx.patchState({
          subscriptions: {
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
        console.error("Error subscriptions:", err);
        return throwError(() => err);
      })
    );
  }
}
