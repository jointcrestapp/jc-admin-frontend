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
  GetShares,
  SetLoadingState,
  GetFilteredMembers,
  EditShares,
  CreateShares,
  UpdateShares,
  DeleteShares,
  AddBatchShares,
  GenerateSharesTemplate,
  ExportShares,
} from "../action/shares.action";
import { SharesService } from "../../../core/services/shares.service";
import { CountryService } from "../../services/country.service";
import { NotificationService } from "../../services/notification.service";
import { ExcelService } from "src/app/core/services/excel.service";
import { SharesExcelService } from "src/app/core/services/shares-export.service";

export interface SharesStateModel {
  shares: {
    data: any[];
    total: any | null;
  };
  loading?: boolean;
  selectedShares?: any | null;
  response?: any | null;
  statistics?: any | null;
  member?: any | null;
}

@State<SharesStateModel>({
  name: "shares",
  defaults: {
    shares: {
      data: [],
      total: 0,
    },
    loading: false,
    selectedShares: null,
    statistics: null,
    member: null,
  },
})
@Injectable()
export class SharesState {
  constructor(
    private sharesService: SharesService,
    private excelService: ExcelService,
    private notificationService: NotificationService,
    private sharesExcelService: SharesExcelService
  ) {}

  @Selector()
  static isLoading(state: SharesStateModel) {
    return state.loading;
  }

  @Selector()
  static savings(state: SharesStateModel) {
    return state.shares;
  }

  @Selector()
  static member(state: SharesStateModel) {
    return state.member;
  }

  @Selector()
  static selectedShares(state: SharesStateModel) {
    return state.selectedShares;
  }

  @Selector()
  static statistics(state: SharesStateModel) {
    return state.statistics;
  }

  @Action(SetLoadingState)
  setLoading(
    ctx: StateContext<SharesStateModel>,
    { isLoading }: SetLoadingState
  ) {
    ctx.patchState({ loading: isLoading });
  }

  @Action(GetShares)
  getShares(ctx: StateContext<SharesStateModel>, { payload }: GetShares) {
    const state = ctx.getState();
    ctx.patchState({ loading: true });

    return this.sharesService.getShares(payload).pipe(
      tap((result: any) => {
        const shares = (result?.data || []).map((element: any) => {
          element.user_country = Number(element.user_country);
          return element;
        });

        ctx.patchState({
          ...state,
          shares: {
            data: shares,
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

  @Action(GetFilteredMembers)
  getFilteredMembers(
    ctx: StateContext<SharesStateModel>,
    { payload }: GetFilteredMembers
  ) {
    const state = ctx.getState();
    ctx.patchState({ loading: true });

    return this.sharesService.getFilteredMember(payload).pipe(
      tap((result: any) => {
        ctx.patchState({
          ...state,
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

  @Action(EditShares)
  editUser(ctx: StateContext<SharesStateModel>, { id }: EditShares) {
    const state = ctx.getState();
    ctx.patchState({ loading: true });

    return this.sharesService.getShares({}).pipe(
      tap((results: any) => {
        const shares = results.data.find((s: any) => s.id == id);
        ctx.patchState({
          ...state,
          selectedShares: shares || null,
        });
      }),
      finalize(() => ctx.patchState({ loading: false }))
    );
  }

  @Action(CreateShares)
  create(ctx: StateContext<SharesStateModel>, { payload }: CreateShares) {
    const state = ctx.getState();
    ctx.patchState({ loading: true });

    return this.sharesService.addShares(payload).pipe(
      tap((res: any) => {
        console.log("Res ::::::", res);
        const state = ctx.getState();
        ctx.patchState({
          ...state,
          shares: {
            data: [...state.shares.data, res.data],
            total: state.shares.total + 1,
          },
          response: res,
        });
      }),
      finalize(() => ctx.patchState({ loading: false })),
      map((res: any) => res) // ✅ this returns the real API response to your component
    );
  }

  @Action(UpdateShares)
  update(ctx: StateContext<SharesStateModel>, { payload, id }: UpdateShares) {
    ctx.patchState({ loading: true });
    return this.sharesService.updateShares(payload, id).pipe(
      tap({
        next: (res: any) => {
          const state = ctx.getState();
          const updatedShare = res.data;
          const updatedShares = state.shares.data.map((share: any) =>
            share.id === id ? updatedShare : share
          );
          const selectedShares =
            state.selectedShares?.id === id
              ? updatedShare
              : state.selectedShares;

          ctx.patchState({
            ...state,
            shares: {
              data: updatedShares,
              total: state.shares.total,
            },
            selectedShares,
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

  @Action(DeleteShares)
  deleteUser(ctx: StateContext<SharesStateModel>, { id }: DeleteShares) {
    ctx.patchState({ loading: true });
    return this.sharesService.deleteShares(id).pipe(
      tap((res) => {
        const state = ctx.getState();
        const filteredShares = state.shares.data.filter(
          (share) => share.id !== id
        );
        ctx.patchState({
          ...state,
          shares: {
            data: filteredShares,
            total: state.shares.total - 1,
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

  @Action(AddBatchShares)
  addBatchShares(
    ctx: StateContext<SharesStateModel>,
    { payload }: AddBatchShares
  ) {
    console.log("Batch data ::::::::", payload);
    return this.sharesService.uploadBatchShares(payload).pipe(
      tap((result: any) => {
        ctx.patchState({
          response: result,
        });
      }),
      finalize(() => ctx.patchState({ loading: false })),
      map((res: any) => res) // ✅ this returns the real API response to your component
    );
  }

  @Action(GenerateSharesTemplate)
  generateSharesTemplate(
    ctx: StateContext<SharesStateModel>,
    { payload }: GenerateSharesTemplate
  ) {
    ctx.patchState({ loading: true });
    return this.excelService.generateSharesTemplate().pipe(
      tap(() => {
        ctx.patchState({ loading: false });
      }),
      catchError((err) => {
        ctx.patchState({ loading: false });
        console.error("Error in generating batch savings:", err);
        return throwError(() => err);
      })
    );
  }

  @Action(ExportShares)
  export(ctx: StateContext<SharesStateModel>, { customData }: ExportShares) {
    const state = ctx.getState();
    ctx.patchState({ loading: true });

    let sharesToExport: any[] = [];

    if (customData && customData.length > 0) {
      sharesToExport = customData;
    } else {
      sharesToExport = state.shares.data;
    }

    if (!sharesToExport || sharesToExport.length === 0) {
      ctx.patchState({ loading: false });
      this.notificationService.showError(`No shares data available to export`);
      return;
    }

    return this.sharesExcelService.exportSharesToExcel(sharesToExport).pipe(
      tap(() => {
        ctx.patchState({ loading: false });
      }),
      catchError((err) => {
        ctx.patchState({ loading: false });
        console.error("Error exporting shares:", err);
        return throwError(() => err);
      })
    );
  }
}
