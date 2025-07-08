import { Injectable } from "@angular/core";
import {
  Action,
  Selector,
  State,
  StateContext,
  UpdateState,
} from "@ngxs/store";
import { catchError, finalize, map, tap, throwError } from "rxjs";
import {
  GetLedgerBalance,
  GetLoanReport,
  GetSavingsReport,
  GetSharesReport,
  GetCreditSalesReport,
  SetLoadingState,
} from "../action/report.action";
import { ReportService } from "../../../core/services/reports.service";

export interface ReportStateModel {
  savings_report: any | null;
  shares_report: any | null;
  loan_report: any | null;
  credit_sales_report: any | null;
  ledger_balance: {
    data: any[];
    total: any | null;
  };
  loading?: boolean;
}

@State<ReportStateModel>({
  name: "reports",
  defaults: {
    savings_report: null,
    shares_report: null,
    loan_report: null,
    credit_sales_report: null,
    ledger_balance: {
      data: [],
      total: null,
    },
    loading: false,
  },
})
@Injectable()
export class ReportState {
  constructor(private reportService: ReportService) {}

  @Selector()
  static isLoading(state: ReportStateModel) {
    return state.loading;
  }

  @Selector()
  static savings_report(state: ReportStateModel) {
    return state.savings_report;
  }

  @Selector()
  static shares_report(state: ReportStateModel) {
    return state.shares_report;
  }

  @Selector()
  static loan_report(state: ReportStateModel) {
    return state.loan_report;
  }

  @Selector()
  static credit_sales_report(state: ReportStateModel) {
    return state.credit_sales_report;
  }

  @Selector()
  static ledger_balance(state: ReportStateModel) {
    return state.ledger_balance;
  }

  @Action(SetLoadingState)
  setLoading(
    ctx: StateContext<ReportStateModel>,
    { isLoading }: SetLoadingState
  ) {
    ctx.patchState({ loading: isLoading });
  }

  @Action(GetSavingsReport)
  getSavings(
    ctx: StateContext<ReportStateModel>,
    { payload }: GetSavingsReport
  ) {
    ctx.patchState({ loading: true });

    return this.reportService.getSavingsReport(payload).pipe(
      tap((result: any) => {
        ctx.patchState({
          savings_report: result?.data,
          loading: false,
        });
      }),
      catchError((err) => {
        ctx.patchState({ loading: false });
        console.error("Error fetching savings report:", err);
        return throwError(() => err);
      })
    );
  }

  @Action(GetSharesReport)
  getSharesReport(
    ctx: StateContext<ReportStateModel>,
    { payload }: GetSharesReport
  ) {
    ctx.patchState({ loading: true });

    return this.reportService.getSharesReport(payload).pipe(
      tap((result: any) => {
        ctx.patchState({
          shares_report: result?.data,
          loading: false,
        });
      }),
      catchError((err) => {
        ctx.patchState({ loading: false });
        console.error("Error fetching shares report:", err);
        return throwError(() => err);
      })
    );
  }

  @Action(GetLedgerBalance)
  getLedgerBalance(
    ctx: StateContext<ReportStateModel>,
    { payload }: GetLedgerBalance
  ) {
    ctx.patchState({ loading: true });

    return this.reportService.getLedgerBalance(payload).pipe(
      tap((result: any) => {
        ctx.patchState({
          ledger_balance: {
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
        console.error("Error fetching ledger balance:", err);
        return throwError(() => err);
      })
    );
  }
  @Action(GetLoanReport)
  getLoanReport(
    ctx: StateContext<ReportStateModel>,
    { payload }: GetLoanReport
  ) {
    ctx.patchState({ loading: true });

    return this.reportService.getLoanReport(payload).pipe(
      tap((result: any) => {
        ctx.patchState({
          loan_report: result?.data,
          loading: false,
        });
      }),
      catchError((err) => {
        ctx.patchState({ loading: false });
        console.error("Error fetching loan report:", err);
        return throwError(() => err);
      })
    );
  }

  @Action(GetCreditSalesReport)
  getCreditSalesReport(
    ctx: StateContext<ReportStateModel>,
    { payload }: GetCreditSalesReport
  ) {
    ctx.patchState({ loading: true });

    return this.reportService.getCreditSalesReport(payload).pipe(
      tap((result: any) => {
        ctx.patchState({
          credit_sales_report: result?.data,
          loading: false,
        });
      }),
      catchError((err) => {
        ctx.patchState({ loading: false });
        console.error("Error fetching credit sales report:", err);
        return throwError(() => err);
      })
    );
  }
}
