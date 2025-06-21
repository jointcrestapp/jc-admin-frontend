import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { catchError, finalize, tap, throwError } from "rxjs";
import {
  EditTransaction,
  GetUserTransaction,
  SetLoadingState,
} from "../action/wallet.action";
import { WalletTxnService } from "src/app/core/services/wallet.service";
import { NotificationService } from "../../services/notification.service";

export interface WalletStateModel {
  transactions: {
    data: any[];
    total: any | null;
  };
  statistics?: any | null;
  selectedTxn?: any | null;
  loading?: boolean;
}

@State<WalletStateModel>({
  name: "wallet",
  defaults: {
    transactions: {
      data: [],
      total: 0,
    },
    statistics: null,
    selectedTxn: null,
    loading: false,
  },
})
@Injectable()
export class WalletState {
  constructor(
    private notificationService: NotificationService,
    private walletService: WalletTxnService
  ) {}

  @Selector()
  static transactions(state: WalletStateModel) {
    return state.transactions;
  }

  @Selector()
  static statistics(state: WalletStateModel) {
    return state.statistics;
  }

  @Selector()
  static isLoading(state: WalletStateModel) {
    return state.loading;
  }

  @Selector()
  static selectedTxn(state: WalletStateModel) {
    return state.selectedTxn;
  }

  @Action(SetLoadingState)
  setLoading(
    ctx: StateContext<WalletStateModel>,
    { isLoading }: SetLoadingState
  ) {
    ctx.patchState({ loading: isLoading });
  }

  @Action(GetUserTransaction)
  getUserTransations(
    ctx: StateContext<WalletStateModel>,
    { payload }: GetUserTransaction
  ) {
    const state = ctx.getState();
    ctx.patchState({ loading: true });

    return this.walletService.getUserTransactions(payload).pipe(
      tap((result: any) => {
        const transactions = (result?.data || []).map((element: any) => {
          element.user_country = Number(element.user_country);
          return element;
        });
        ctx.patchState({
          ...state,
          transactions: {
            data: transactions,
            total:
              result?.pagination?.total ||
              result?.total ||
              result?.data?.length,
          },
          statistics: result?.counts,
          loading: false,
        });
      }),
      catchError((err) => {
        ctx.patchState({ loading: false });
        console.error("Error fetching Transactions:", err);
        return throwError(() => err);
      })
    );
  }

  @Action(EditTransaction)
  editUser(ctx: StateContext<WalletStateModel>, { id }: EditTransaction) {
    const state = ctx.getState();
    ctx.patchState({ loading: true });

    return this.walletService.getUserTransactions({}).pipe(
      tap((results: any) => {
        const txn = results.data.find((s: any) => s.id == id);
        ctx.patchState({
          selectedTxn: txn || null,
        });
      }),
      finalize(() => ctx.patchState({ loading: false }))
    );
  }
}
