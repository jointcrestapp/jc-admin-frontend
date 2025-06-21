import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { catchError, finalize, map, tap, throwError } from "rxjs";
import { InvestmentService } from "../../../core/services/investment.service";
import {
  SetLoadingState,
  GetInvestments,
  EditInvestment,
  CreateInvestment,
  UpdateInvestment,
  DeleteInvestment,
} from "../action/investment.action";

export interface InvestmentsStateModel {
  loading?: boolean;
  response?: any | null;
  investments?: {
    data: any[];
    total: any | null;
  };
  SelectedInvestment?: any | null;
}

@State<InvestmentsStateModel>({
  name: "investments",
  defaults: {
    loading: false,
    SelectedInvestment: null,
    investments: {
      data: [],
      total: 0,
    },
  },
})
@Injectable()
export class InvestmentsState {
  constructor(private investmentsService: InvestmentService) {}

  @Selector()
  static isLoading(state: InvestmentsStateModel) {
    return state.loading;
  }

  @Selector()
  static selectedInvestment(state: InvestmentsStateModel) {
    return state.SelectedInvestment;
  }

  @Selector()
  static investments(state: InvestmentsStateModel) {
    return state.investments;
  }

  @Action(SetLoadingState)
  setLoading(
    ctx: StateContext<InvestmentsStateModel>,
    { isLoading }: SetLoadingState
  ) {
    ctx.patchState({ loading: isLoading });
  }

  //Investments
  @Action(GetInvestments)
  getInvestmentTypes(
    ctx: StateContext<InvestmentsStateModel>,
    { payload }: GetInvestments
  ) {
    const state = ctx.getState();
    ctx.patchState({ loading: true });

    return this.investmentsService.getInvestments(payload).pipe(
      tap((result: any) => {
        ctx.patchState({
          investments: {
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
        console.error("Error fetching investment:", err);
        return throwError(() => err);
      })
    );
  }

  @Action(EditInvestment)
  editInvestmentType(
    ctx: StateContext<InvestmentsStateModel>,
    { id }: EditInvestment
  ) {
    ctx.patchState({ loading: true });

    return this.investmentsService.getInvestments({}).pipe(
      tap((results: any) => {
        const investments = results.data.find(
          (investment: any) => investment.id == id
        );
        ctx.patchState({
          SelectedInvestment: investments || null,
        });
      }),
      finalize(() => ctx.patchState({ loading: false }))
    );
  }

  @Action(CreateInvestment)
  createInvestmentType(
    ctx: StateContext<InvestmentsStateModel>,
    { payload }: CreateInvestment
  ) {
    const state = ctx.getState();
    ctx.patchState({ loading: true });

    return this.investmentsService.addInvestment(payload).pipe(
      tap((res: any) => {
        const state = ctx.getState();
        ctx.patchState({
          investments: {
            data: [...state.investments.data, res.data],
            total: state.investments.total + 1,
          },
          response: res,
        });
      }),
      finalize(() => ctx.patchState({ loading: false })),
      map((res: any) => res) // ✅ this returns the real API response to your component
    );
  }

  @Action(UpdateInvestment)
  updateInvestmentType(
    ctx: StateContext<InvestmentsStateModel>,
    { payload, id }: UpdateInvestment
  ) {
    ctx.patchState({ loading: true });
    return this.investmentsService.updateInvestment(payload, id).pipe(
      tap({
        next: (res: any) => {
          const state = ctx.getState();
          const updatedInvestment = res.data;
          const updatedInvestments = state.investments.data.map(
            (investment: any) =>
              investment.id === id ? updatedInvestment : investment
          );
          const selectedInvestment =
            state.SelectedInvestment?.id === id
              ? updatedInvestment
              : state.SelectedInvestment;

          ctx.patchState({
            investments: {
              data: updatedInvestments,
              total: state.investments.total,
            },
            SelectedInvestment: selectedInvestment,
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

  @Action(DeleteInvestment)
  deleteInvestmentType(
    ctx: StateContext<InvestmentsStateModel>,
    { id }: DeleteInvestment
  ) {
    ctx.patchState({ loading: true });
    return this.investmentsService.deleteInvestment(id).pipe(
      tap((res) => {
        const state = ctx.getState();
        const filteredInvestment = state.investments.data.filter(
          (investment) => investment.id !== id
        );
        ctx.patchState({
          investments: {
            data: filteredInvestment,
            total: state.investments.total - 1,
          },
          loading: false,
          response: res,
        });
      }),
      catchError((err) => {
        ctx.patchState({ loading: false });
        console.error("Error deleting Investment:", err);
        return throwError(() => err);
      })
    );
  }
}
