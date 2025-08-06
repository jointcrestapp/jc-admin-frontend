import { Injectable } from "@angular/core";
import { Store, Action, Selector, State, StateContext } from "@ngxs/store";
import { catchError, finalize, map, tap, throwError } from "rxjs";
import {
  GetFilteredMembers,
  GetWithdrawRequest,
  SetLoadingState,
  UpdateWithdrawStatus,
  WithdrawRequest,
  GetPendingWithdraw,
  EditWithdrawal,
  UpdateWithdrawal,
  CreateWithdrawal,
} from "../action/withdrawal.action";
import { WithdrawalService } from "src/app/core/services/withdrawal.service";
import { NotificationService } from "../../services/notification.service";

export interface WithdrawalStateModel {
  withdrawal: {
    data: any[];
    total: any | null;
  };
  pendingWithdrawal?: {
    data: any[];
    total: any | null;
  };
  loading?: boolean;
  selectedWithdrawal?: any | null;
  response?: any | null;
  statistics?: any | null;
  member?: any | null;
}

@State<WithdrawalStateModel>({
  name: "withdrawal",
  defaults: {
    withdrawal: {
      data: [],
      total: 0,
    },
    pendingWithdrawal: {
      data: [],
      total: 0,
    },
    loading: false,
    response: null,
    selectedWithdrawal: null,
    statistics: null,
    member: null,
  },
})
@Injectable()
export class WithdrawalState {
  constructor(
    
    private notificationService: NotificationService,
    private withdrawalService: WithdrawalService
  ) {}

  @Selector()
  static isLoading(state: WithdrawalStateModel) {
    return state.loading;
  }

  @Selector()
  static withdrawal(state: WithdrawalStateModel) {
    return state.withdrawal;
  }

  @Selector()
  static pending_withdrawal(state: WithdrawalStateModel) {
    return state.pendingWithdrawal;
  }

  @Selector()
  static member(state: WithdrawalStateModel) {
    return state.member;
  }

  @Selector()
  static selectedWithdrawal(state: WithdrawalStateModel) {
    return state.selectedWithdrawal;
  }

  @Selector()
  static statistics(state: WithdrawalStateModel) {
    return state.statistics;
  }

  @Action(SetLoadingState)
  setLoading(
    ctx: StateContext<WithdrawalStateModel>,
    { isLoading }: SetLoadingState
  ) {
    ctx.patchState({ loading: isLoading });
  }

  @Action(GetWithdrawRequest)
  getWithdrawal(
    ctx: StateContext<WithdrawalStateModel>,
    { payload }: GetWithdrawRequest
  ) {
    const state = ctx.getState();
    ctx.patchState({ loading: true });

    return this.withdrawalService.getWithdrawal(payload).pipe(
      tap((result: any) => {
        ctx.patchState({
          withdrawal: {
            data: result?.data,
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
        console.error("Error fetching withdrawal:", err);
        return throwError(() => err);
      })
    );
  }

  @Action(EditWithdrawal)
  editUser(ctx: StateContext<WithdrawalStateModel>, { id }: EditWithdrawal) {
    const state = ctx.getState();
    ctx.patchState({ loading: true });

    return this.withdrawalService.getWithdrawal({}).pipe(
      tap((results: any) => {
        const withdrawals = results.data.find((s: any) => s.id == id);
        ctx.patchState({
          selectedWithdrawal: withdrawals || null,
        });
      }),
      finalize(() => ctx.patchState({ loading: false }))
    );
  }

  @Action(UpdateWithdrawal)
  update(
    ctx: StateContext<WithdrawalStateModel>,
    { payload, id }: UpdateWithdrawal
  ) {
    ctx.patchState({ loading: true });
    return this.withdrawalService.updateWithdrawalRequest(payload, id).pipe(
      tap({
        next: (res: any) => {
          const state = ctx.getState();
          const updatedWithdraw = res.data;
          const updatedWithdraws = state.withdrawal.data.map(
            (withdrawal: any) =>
              withdrawal.id === id ? updatedWithdraw : withdrawal
          );
          const selectedWithdrawal =
            state.selectedWithdrawal?.id === id
              ? updatedWithdraw
              : state.selectedWithdrawal;

          ctx.patchState({
            withdrawal: {
              data: updatedWithdraws,
              total: state.withdrawal.total,
            },
            selectedWithdrawal,
            response: res,
          });
        },
        error: (err) => {
          throw new Error(err?.error?.message || "Update failed");
        },
      }),
      finalize(() => ctx.patchState({ loading: false }))
    );
  }

  @Action(CreateWithdrawal)
  create(
    ctx: StateContext<WithdrawalStateModel>,
    { payload }: CreateWithdrawal
  ) {
    ctx.patchState({ loading: true });
    return this.withdrawalService.addWithdrawalRequest(payload).pipe(
      tap((res: any) => {
        const state = ctx.getState();
        ctx.patchState({
          withdrawal: {
            data: [...state.withdrawal.data, res.data],
            total: state.withdrawal.total + 1,
          },
          response: res,
        });
      }),
      finalize(() => ctx.patchState({ loading: false })),
      map((res: any) => res) // ✅ this returns the real API response to your component
    );
  }

  @Action(GetPendingWithdraw)
  getPendingWithdrawal(
    ctx: StateContext<WithdrawalStateModel>,
    { payload }: GetPendingWithdraw
  ) {
    const state = ctx.getState();
    ctx.patchState({ loading: true });

    return this.withdrawalService.getPendingWithdrawal(payload).pipe(
      tap((result: any) => {
        ctx.patchState({
          pendingWithdrawal: {
            data: result?.data,
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
        console.error("Error fetching pending withdrawal:", err);
        return throwError(() => err);
      })
    );
  }

  @Action(GetFilteredMembers)
  getFilteredMembers(
    ctx: StateContext<WithdrawalStateModel>,
    { payload }: GetFilteredMembers
  ) {
    const state = ctx.getState();
    ctx.patchState({ loading: true });

    return this.withdrawalService.getFilteredMember(payload).pipe(
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

  @Action(WithdrawRequest)
  createRequest(
    ctx: StateContext<WithdrawalStateModel>,
    action: WithdrawRequest
  ) {
    // Create Withdrawal Logic Here
  }

  @Action(UpdateWithdrawStatus)
  updateWithdrawStatus(
    ctx: StateContext<WithdrawalStateModel>,
    { id, status }: UpdateWithdrawStatus
  ) {
    // Update Withdrawal Status Logic Here
  }
}
