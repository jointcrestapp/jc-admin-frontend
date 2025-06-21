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
  GetLoan,
  SetLoadingState,
  GetFilteredMembers,
  EditLoan,
  CreateLoan,
  UpdateLoan,
  DeleteLoan,
  GetLoanType,
  GetApprovedLoan,
  GetDisbursedLoan,
  GetFinishedLoan,
  ApproveLoanStatus,
  DispatchLoanStatus,
  GetPaidLoan,
  GetDueLoan,
  EditDisbursedLoan,
  EditApprovedLoan,
  EditFinishedLoan,
  GenerateLoanTemplate,
  AddBatchLoan,
} from "../action/loan.action";
import { LoanService } from "../../../core/services/loan.service";
import { NotificationService } from "../../services/notification.service";
import { ExcelService } from "src/app/core/services/excel.service";

export interface LoanStateModel {
  request_loans: {
    data: any[];
    total: any | null;
  };
  paid_loans: {
    data: any[];
    total: any | null;
  };
  approved_loans?: {
    data: any[];
    total: any | null;
  };
  disbursed_loans?: {
    data: any[];
    total: any | null;
  };
  finished_loans?: {
    data: any[];
    total: any | null;
  };
  due_loans?: {
    data: any[];
    total: any | null;
  };
  loading?: boolean;
  selectedLoan?: any | null;
  loan_type?: any[];
  response?: any | null;
  statistics?: any | null;
  member?: any | null;
}

@State<LoanStateModel>({
  name: "loan",
  defaults: {
    request_loans: {
      data: [],
      total: 0,
    },
    paid_loans: {
      data: [],
      total: 0,
    },
    approved_loans: {
      data: [],
      total: 0,
    },
    disbursed_loans: {
      data: [],
      total: 0,
    },
    finished_loans: {
      data: [],
      total: 0,
    },
    due_loans: {
      data: [],
      total: 0,
    },
    loading: false,
    selectedLoan: null,
    statistics: null,
    member: null,
    loan_type: [],
  },
})
@Injectable()
export class LoanState {
  constructor(
    private loanService: LoanService,
    private notificationService: NotificationService,
    private excelService: ExcelService
  ) {}

  @Selector()
  static isLoading(state: LoanStateModel) {
    return state.loading;
  }

  @Selector()
  static request_loans(state: LoanStateModel) {
    return state.request_loans;
  }

  @Selector()
  static paid_loans(state: LoanStateModel) {
    return state.paid_loans;
  }

  @Selector()
  static approved_loans(state: LoanStateModel) {
    return state.approved_loans;
  }

  @Selector()
  static disbursed_loans(state: LoanStateModel) {
    return state.disbursed_loans;
  }

  @Selector()
  static finished_loans(state: LoanStateModel) {
    return state.finished_loans;
  }

  @Selector()
  static due_loans(state: LoanStateModel) {
    return state.due_loans;
  }

  @Selector()
  static loan_type(state: LoanStateModel) {
    return state.loan_type;
  }

  @Selector()
  static member(state: LoanStateModel) {
    return state.member;
  }

  @Selector()
  static selectedLoan(state: LoanStateModel) {
    return state.selectedLoan;
  }

  @Selector()
  static statistics(state: LoanStateModel) {
    return state.statistics;
  }

  @Action(SetLoadingState)
  setLoading(
    ctx: StateContext<LoanStateModel>,
    { isLoading }: SetLoadingState
  ) {
    ctx.patchState({ loading: isLoading });
  }

  @Action(GetLoan)
  getLoanRequest(ctx: StateContext<LoanStateModel>, { payload }: GetLoan) {
    ctx.patchState({ loading: true });

    return this.loanService.getLoanHistory(payload).pipe(
      tap((result: any) => {
        ctx.patchState({
          request_loans: {
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
        console.error("Error fetching users:", err);
        return throwError(() => err);
      })
    );
  }

  @Action(ApproveLoanStatus)
  update(
    ctx: StateContext<LoanStateModel>,
    { payload, id }: ApproveLoanStatus
  ) {
    ctx.patchState({ loading: true });
    const state = ctx.getState();
    return this.loanService.approveLoanStatus(payload, id).pipe(
      tap({
        next: (res: any) => {
          const updatedLoan = res.data;
          const updatedLoans = state.request_loans.data.map((loan) =>
            loan.id === id ? updatedLoan : loan
          );
          const selectedLoan =
            state.selectedLoan?.id === id ? updatedLoan : state.selectedLoan;

          ctx.patchState({
            request_loans: {
              data: updatedLoans,
              total: state.request_loans.total,
            },
            selectedLoan,
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

  @Action(GetApprovedLoan)
  getApprovedLoans(
    ctx: StateContext<LoanStateModel>,
    { payload }: GetApprovedLoan
  ) {
    const state = ctx.getState();
    ctx.patchState({ loading: true });

    return this.loanService.getApprovedLoanHistory(payload).pipe(
      tap((result: any) => {
        ctx.patchState({
          ...state,
          approved_loans: {
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
        console.error("Error fetching users:", err);
        return throwError(() => err);
      })
    );
  }

  @Action(DispatchLoanStatus)
  dispatchLoanStatus(
    ctx: StateContext<LoanStateModel>,
    { payload, id }: DispatchLoanStatus
  ) {
    ctx.patchState({ loading: true });
    const state = ctx.getState();
    return this.loanService.dispatchLoanStatus(payload, id).pipe(
      tap({
        next: (res: any) => {
          const updatedLoan = res.data;
          const updatedLoans = state.approved_loans.data.map((loan) =>
            loan.id === id ? updatedLoan : loan
          );
          const selectedLoan =
            state.selectedLoan?.id === id ? updatedLoan : state.selectedLoan;

          ctx.patchState({
            approved_loans: {
              data: updatedLoans,
              total: state.approved_loans.total,
            },
            selectedLoan,
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

  @Action(GetDisbursedLoan)
  getDisbursedLoans(
    ctx: StateContext<LoanStateModel>,
    { payload }: GetDisbursedLoan
  ) {
    const state = ctx.getState();
    ctx.patchState({ loading: true });

    return this.loanService.getDisbursedLoanHistory(payload).pipe(
      tap((result: any) => {
        ctx.patchState({
          disbursed_loans: {
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
        console.error("Error fetching users:", err);
        return throwError(() => err);
      })
    );
  }

  @Action(GetFinishedLoan)
  getFinishedLoans(
    ctx: StateContext<LoanStateModel>,
    { payload }: GetFinishedLoan
  ) {
    const state = ctx.getState();
    ctx.patchState({ loading: true });

    return this.loanService.getFinishedLoanHistory(payload).pipe(
      tap((result: any) => {
        ctx.patchState({
          finished_loans: {
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
        console.error("Error fetching users:", err);
        return throwError(() => err);
      })
    );
  }

  @Action(GetLoanType)
  getLoanType(ctx: StateContext<LoanStateModel>, { payload }: GetLoanType) {
    const state = ctx.getState();
    ctx.patchState({ loading: true });

    return this.loanService.getLoanType(payload).pipe(
      tap((result: any) => {
        ctx.patchState({
          loan_type: result?.data,
          loading: false,
        });
      }),
      catchError((err) => {
        ctx.patchState({ loading: false });
        console.error("Error fetching loan Type:", err);
        return throwError(() => err);
      })
    );
  }

  @Action(GetFilteredMembers)
  getFilteredMembers(
    ctx: StateContext<LoanStateModel>,
    { payload }: GetFilteredMembers
  ) {
    const state = ctx.getState();
    ctx.patchState({ loading: true });

    return this.loanService.getFilteredMember(payload).pipe(
      tap((result: any) => {
        ctx.patchState({
          member: result?.data,
          loading: false,
        });
      }),
      catchError((err) => {
        ctx.patchState({ loading: false });
        console.error("Error fetching users:", err);
        return throwError(() => err);
      })
    );
  }

  @Action(EditLoan)
  editUser(ctx: StateContext<LoanStateModel>, { id }: EditLoan) {
    const state = ctx.getState();
    ctx.patchState({ loading: true });

    return this.loanService.getLoanHistory({}).pipe(
      tap((results: any) => {
        const loan = results.data.find((s: any) => s.id == id);
        ctx.patchState({
          selectedLoan: loan || null,
        });
      }),
      finalize(() => ctx.patchState({ loading: false }))
    );
  }

  @Action(EditDisbursedLoan)
  editDisbursedUser(
    ctx: StateContext<LoanStateModel>,
    { id }: EditDisbursedLoan
  ) {
    const state = ctx.getState();
    ctx.patchState({ loading: true });

    return this.loanService.getDisbursedLoanHistory({}).pipe(
      tap((results: any) => {
        const loan = results.data.find((s: any) => s.id == id);
        ctx.patchState({
          selectedLoan: loan || null,
        });
      }),
      finalize(() => ctx.patchState({ loading: false }))
    );
  }

  @Action(EditApprovedLoan)
  editApprovedUser(
    ctx: StateContext<LoanStateModel>,
    { id }: EditApprovedLoan
  ) {
    const state = ctx.getState();
    ctx.patchState({ loading: true });

    return this.loanService.getApprovedLoanHistory({}).pipe(
      tap((results: any) => {
        const loan = results.data.find((s: any) => s.id == id);
        ctx.patchState({
          selectedLoan: loan || null,
        });
      }),
      finalize(() => ctx.patchState({ loading: false }))
    );
  }

  @Action(EditFinishedLoan)
  editFinishedUser(
    ctx: StateContext<LoanStateModel>,
    { id }: EditFinishedLoan
  ) {
    ctx.patchState({ loading: true });

    return this.loanService.getFinishedLoanHistory({}).pipe(
      tap((results: any) => {
        const loan = results.data.find((s: any) => s.id == id);
        ctx.patchState({
          selectedLoan: loan || null,
        });
      }),
      finalize(() => ctx.patchState({ loading: false }))
    );
  }

  @Action(CreateLoan)
  create(ctx: StateContext<LoanStateModel>, { payload }: CreateLoan) {
    const state = ctx.getState();
    ctx.patchState({ loading: true });

    return this.loanService.saveLoanRequest(payload).pipe(
      tap((res: any) => {
        const state = ctx.getState();
        ctx.patchState({
          request_loans: {
            data: [...state.request_loans.data, res.data],
            total: state.request_loans.total + 1,
          },
          response: res,
        });
      }),
      finalize(() => ctx.patchState({ loading: false })),
      map((res: any) => res) // ✅ this returns the real API response to your component
    );
  }

  @Action(UpdateLoan)
  updateLoan(ctx: StateContext<LoanStateModel>, { payload, id }: UpdateLoan) {
    ctx.patchState({ loading: true });
    return this.loanService.updateLoan(payload, id).pipe(
      tap({
        next: (res: any) => {
          const state = ctx.getState();
          const updatedLoan = res.data;
          const updatedRequestLoans = state.request_loans.data.map(
            (loan: any) => (loan.id === id ? updatedLoan : loan)
          );
          const updatedApprovedLoans = state.approved_loans.data.map((loan) =>
            loan.id === id ? updatedLoan : loan
          );
          const updatedDisbursedLoans = state.disbursed_loans.data.map((loan) =>
            loan.id === id ? updatedLoan : loan
          );
          const updatedFinishedLoans = state.finished_loans.data.map((loan) =>
            loan.id === id ? updatedLoan : loan
          );
          const selectedLoan =
            state.selectedLoan?.id === id ? updatedLoan : state.selectedLoan;

          ctx.patchState({
            request_loans: {
              data: updatedRequestLoans,
              total: state.request_loans.total,
            },
            approved_loans: {
              data: updatedApprovedLoans,
              total: state.approved_loans.total,
            },
            disbursed_loans: {
              data: updatedDisbursedLoans,
              total: state.disbursed_loans.total,
            },
            finished_loans: {
              data: updatedDisbursedLoans,
              total: state.disbursed_loans.total,
            },
            selectedLoan,
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

  @Action(DeleteLoan)
  deleteLoan(ctx: StateContext<LoanStateModel>, { id }: DeleteLoan) {
    ctx.patchState({ loading: true });
    return this.loanService.deleteLoan(id).pipe(
      tap((res) => {
        const state = ctx.getState();
        const filteredRequestLoans = state.request_loans.data.filter(
          (loan) => loan.id !== id
        );
        ctx.patchState({
          request_loans: {
            data: filteredRequestLoans,
            total: state.request_loans.total - 1,
          },
          loading: false,
          response: res,
        });
      }),
      catchError((err) => {
        ctx.patchState({ loading: false });
        console.error("Error deleting user:", err);
        return throwError(() => err);
      })
    );
  }

  @Action(GetPaidLoan)
  getPaidLoans(ctx: StateContext<LoanStateModel>, { payload }: GetPaidLoan) {
    const state = ctx.getState();
    ctx.patchState({ loading: true });

    return this.loanService.getPaidLoanHistory(payload).pipe(
      tap((result: any) => {
        ctx.patchState({
          paid_loans: {
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
        console.error("Error fetching users:", err);
        return throwError(() => err);
      })
    );
  }

  @Action(GetDueLoan)
  getDueLoans(ctx: StateContext<LoanStateModel>, { payload }: GetDueLoan) {
    ctx.patchState({ loading: true });
    return this.loanService.getDueLoanHistory(payload).pipe(
      tap((result: any) => {
        ctx.patchState({
          due_loans: {
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
        console.error("Error fetching Due Loans History:", err);
        return throwError(() => err);
      })
    );
  }

  @Action(AddBatchLoan)
  addBatchLoan(ctx: StateContext<LoanStateModel>, { payload }: AddBatchLoan) {
    console.log("Batch data ::::::::", payload);
    return this.loanService.uploadBatchLoan(payload).pipe(
      tap((result: any) => {
        ctx.patchState({
          response: result,
        });
      }),
      finalize(() => ctx.patchState({ loading: false })),
      map((res: any) => res) // ✅ this returns the real API response to your component
    );
  }

  @Action(GenerateLoanTemplate)
  generateSavingsTemplate(
    ctx: StateContext<LoanStateModel>,
    { payload }: GenerateLoanTemplate
  ) {
    ctx.patchState({ loading: true });
    return this.excelService.generateLoanTemplate().pipe(
      tap(() => {
        ctx.patchState({ loading: false });
      }),
      catchError((err) => {
        ctx.patchState({ loading: false });
        console.error("Error in generating batch loan:", err);
        return throwError(() => err);
      })
    );
  }
}
