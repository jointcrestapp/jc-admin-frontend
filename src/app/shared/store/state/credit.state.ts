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
  AddCreditSales,
  ApproveCreditSalesStatus,
  ApprovedCreditSales,
  DeleteCreditSales,
  DispatchCreditSalesStatus,
  DispatchedCreditSales,
  EditCredit,
  OrderCreditSales,
  OrderedProducts,
  RequestedCreditSales,
  SetLoadingState,
} from "../action/credit.action";
import { CreditService } from "../../../core/services/credit.service";

export interface CreditStateModel {
  request_credit_sales: {
    data: any[];
    total: any | null;
  };
  approved_credit_sales: {
    data: any[];
    total: any | null;
  };
  dispatched_credit_sales: {
    data: any[];
    total: any | null;
  };
  order_credit_sales: {
    data: any[];
    total: any | null;
  };
  ordered_products: {
    data: any[];
    total: any | null;
  };
  loading?: boolean;
  response: any | null;
  statistics?: any | null;
  selectedCreditSales?: any | null;
}

@State<CreditStateModel>({
  name: "credit",
  defaults: {
    dispatched_credit_sales: {
      data: [],
      total: 0,
    },
    approved_credit_sales: {
      data: [],
      total: 0,
    },
    request_credit_sales: {
      data: [],
      total: 0,
    },
    order_credit_sales: {
      data: [],
      total: null,
    },
    ordered_products: {
      data: [],
      total: null,
    },
    loading: false,
    response: null,
    statistics: null,
    selectedCreditSales: null,
  },
})
@Injectable()
export class CreditState {
  constructor(private creditService: CreditService) {}

  @Selector()
  static isLoading(state: CreditStateModel) {
    return state.loading;
  }

  @Selector()
  static order_credit_sales(state: CreditStateModel) {
    return state.order_credit_sales;
  }

  @Selector()
  static request_credit_sales(state: CreditStateModel) {
    return state.request_credit_sales;
  }

  @Selector()
  static approved_credit_sales(state: CreditStateModel) {
    return state.approved_credit_sales;
  }

  @Selector()
  static dispatched_credit_sales(state: CreditStateModel) {
    return state.dispatched_credit_sales;
  }

  @Selector()
  static ordered_products(state: CreditStateModel) {
    return state.ordered_products;
  }

  @Selector()
  static statistics(state: CreditStateModel) {
    return state.statistics;
  }

  @Selector()
  static selectedCreditSales(state: CreditStateModel) {
    return state.selectedCreditSales;
  }

  @Action(SetLoadingState)
  setLoading(
    ctx: StateContext<CreditStateModel>,
    { isLoading }: SetLoadingState
  ) {
    ctx.patchState({ loading: isLoading });
  }

  @Action(OrderCreditSales)
  orderCreditSales(
    ctx: StateContext<CreditStateModel>,
    { payload }: OrderCreditSales
  ) {
    ctx.patchState({ loading: true });

    return this.creditService.orderCreditSales(payload).pipe(
      tap((result: any) => {
        ctx.patchState({
          order_credit_sales: {
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
        console.error("Error order credit sales:", err);
        return throwError(() => err);
      })
    );
  }

  @Action(AddCreditSales)
  create(ctx: StateContext<CreditStateModel>, { payload }: AddCreditSales) {
    ctx.patchState({ loading: true });

    return this.creditService.addCreditSales(payload).pipe(
      tap((res: any) => {
        const state = ctx.getState();
        ctx.patchState({
          order_credit_sales: {
            data: [...state.order_credit_sales.data],
            total: state.order_credit_sales.total,
          },
          response: res,
        });
      }),
      finalize(() => ctx.patchState({ loading: false })),
      map((res: any) => res) // ✅ this returns the real API response to your component
    );
  }

  @Action(RequestedCreditSales)
  requestedCreditSales(
    ctx: StateContext<CreditStateModel>,
    { payload }: RequestedCreditSales
  ) {
    ctx.patchState({ loading: true });

    return this.creditService.requestedCreditSales(payload).pipe(
      tap((result: any) => {
        ctx.patchState({
          request_credit_sales: {
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
        console.error("Error fetching requested credit sales:", err);
        return throwError(() => err);
      })
    );
  }

  @Action(EditCredit)
  editUser(ctx: StateContext<CreditStateModel>, { id }: EditCredit) {
    const state = ctx.getState();
    ctx.patchState({ loading: true });

    return this.creditService.requestedCreditSales({}).pipe(
      tap((results: any) => {
        const creditSales = results.data.find((s: any) => s.id == id);
        ctx.patchState({
          selectedCreditSales: creditSales || null,
        });
      }),
      finalize(() => ctx.patchState({ loading: false }))
    );
  }

  @Action(ApproveCreditSalesStatus)
  update(
    ctx: StateContext<CreditStateModel>,
    { payload, id }: ApproveCreditSalesStatus
  ) {
    ctx.patchState({ loading: true });
    const state = ctx.getState();
    return this.creditService.approveCreditSalesStatus(payload, id).pipe(
      tap({
        next: (res: any) => {
          const updatedCreditSale = res.data;
          const updatedCreditSales = state.order_credit_sales.data.map((ocs) =>
            ocs.id === id ? updatedCreditSale : ocs
          );
          const selectedCreditSales =
            state.selectedCreditSales?.id === id
              ? updatedCreditSale
              : state.selectedCreditSales;

          ctx.patchState({
            order_credit_sales: {
              data: updatedCreditSales,
              total: state.order_credit_sales.total,
            },
            selectedCreditSales,
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

  @Action(DeleteCreditSales)
  deleteUser(ctx: StateContext<CreditStateModel>, { id }: DeleteCreditSales) {
    ctx.patchState({ loading: true });
    return this.creditService.deleteCreditSales(id).pipe(
      tap((res) => {
        const state = ctx.getState();
        const filteredCreditSales = state.order_credit_sales.data.filter(
          (cs) => cs.id !== id
        );
        ctx.patchState({
          order_credit_sales: {
            data: filteredCreditSales,
            total: state.order_credit_sales.total - 1,
          },
          loading: false,
          response: res,
        });
      }),
      catchError((err) => {
        ctx.patchState({ loading: false });
        console.error("Error deleting credit sales:", err);
        return throwError(() => err);
      })
    );
  }

  @Action(ApprovedCreditSales)
  approvedCreditSales(
    ctx: StateContext<CreditStateModel>,
    { payload }: ApprovedCreditSales
  ) {
    ctx.patchState({ loading: true });

    return this.creditService.approvedCreditSales(payload).pipe(
      tap((result: any) => {
        ctx.patchState({
          approved_credit_sales: {
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
        console.error("Error fetching approved credit sales:", err);
        return throwError(() => err);
      })
    );
  }

  @Action(DispatchedCreditSales)
  dispatchedCreditSales(
    ctx: StateContext<CreditStateModel>,
    { payload }: DispatchedCreditSales
  ) {
    ctx.patchState({ loading: true });

    return this.creditService.dispatchedCreditSales(payload).pipe(
      tap((result: any) => {
        ctx.patchState({
          dispatched_credit_sales: {
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
        console.error("Error fetching dispatched credit sales:", err);
        return throwError(() => err);
      })
    );
  }

  @Action(DispatchCreditSalesStatus)
  dispacthCreditSalesStatus(
    ctx: StateContext<CreditStateModel>,
    { payload, id }: DispatchCreditSalesStatus
  ) {
    ctx.patchState({ loading: true });
    const state = ctx.getState();
    return this.creditService.dispatchCreditSalesStatus(payload, id).pipe(
      tap({
        next: (res: any) => {
          const updatedCreditSale = res.data;
          const updatedCreditSales = state.dispatched_credit_sales.data.map(
            (ocs) => (ocs.id === id ? updatedCreditSale : ocs)
          );
          const selectedCreditSales =
            state.selectedCreditSales?.id === id
              ? updatedCreditSale
              : state.selectedCreditSales;

          ctx.patchState({
            dispatched_credit_sales: {
              data: updatedCreditSales,
              total: state.dispatched_credit_sales.total,
            },
            selectedCreditSales,
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

  @Action(OrderedProducts)
  orderedProducts(
    ctx: StateContext<CreditStateModel>,
    { payload }: OrderedProducts
  ) {
    ctx.patchState({ loading: true });

    return this.creditService.orderedProducts(payload).pipe(
      tap((result: any) => {
        ctx.patchState({
          ordered_products: {
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
        console.error("Error fetching ordered products:", err);
        return throwError(() => err);
      })
    );
  }
}
