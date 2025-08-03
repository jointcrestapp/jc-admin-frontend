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
  GetSavings,
  SetLoadingState,
  GetFilteredMembers,
  EditSavings,
  CreateSavings,
  UpdateSavings,
  DeleteSaving,
  GenerateSavingsTemplate,
  AddBatchSavings,
  ExportSavings,
} from "../action/savings.action";
import { SavingsService } from "../../../core/services/savings.service";
import { CountryService } from "../../services/country.service";
import { NotificationService } from "../../services/notification.service";
import { appConfig } from "src/app/core/config/config";
import { ExcelService } from "src/app/core/services/excel.service";
import { SavingsExcelService } from "src/app/core/services/savings-export.service";

export interface SavingsStateModel {
  savings: {
    data: any[];
    total: any | null;
  };
  loading?: boolean;
  selectedSavings?: any | null;
  response?: any | null;
  statistics?: any | null;
  member?: any | null;
}

@State<SavingsStateModel>({
  name: "savings",
  defaults: {
    savings: {
      data: [],
      total: 0,
    },
    loading: false,
    selectedSavings: null,
    statistics: null,
    member: null,
  },
})
@Injectable()
export class SavingsState {
  constructor(
    private savingsService: SavingsService,
    private countryService: CountryService,
    private notificationService: NotificationService,
    private excelService: ExcelService,
    private savingsExcelService: SavingsExcelService
  ) {}

  @Selector()
  static isLoading(state: SavingsStateModel) {
    return state.loading;
  }

  @Selector()
  static savings(state: SavingsStateModel) {
    return state.savings;
  }

  @Selector()
  static member(state: SavingsStateModel) {
    return state.member;
  }

  @Selector()
  static selectedSavings(state: SavingsStateModel) {
    return state.selectedSavings;
  }

  @Selector()
  static statistics(state: SavingsStateModel) {
    return state.statistics;
  }

  @Action(SetLoadingState)
  setLoading(
    ctx: StateContext<SavingsStateModel>,
    { isLoading }: SetLoadingState
  ) {
    ctx.patchState({ loading: isLoading });
  }

  @Action(GetSavings)
  getSavings(ctx: StateContext<SavingsStateModel>, { payload }: GetSavings) {
    const state = ctx.getState();
    ctx.patchState({ loading: true });

    return this.savingsService.getSavings(payload).pipe(
      tap((result: any) => {
        const savings = (result?.data || []).map((element: any) => {
          element.user_country = Number(element.user_country);
          return element;
        });
        ctx.patchState({
          savings: {
            data: savings,
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
    ctx: StateContext<SavingsStateModel>,
    { payload }: GetFilteredMembers
  ) {
    const state = ctx.getState();
    ctx.patchState({ loading: true });

    return this.savingsService.getFilteredMember(payload).pipe(
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

  @Action(EditSavings)
  editUser(ctx: StateContext<SavingsStateModel>, { id }: EditSavings) {
    const state = ctx.getState();
    ctx.patchState({ loading: true });

    return this.savingsService.getSavings({}).pipe(
      tap((results: any) => {
        const savings = results.data.find((s: any) => s.id == id);
        ctx.patchState({
          ...state,
          selectedSavings: savings || null,
        });
      }),
      finalize(() => ctx.patchState({ loading: false }))
    );
  }

  @Action(CreateSavings)
  create(ctx: StateContext<SavingsStateModel>, { payload }: CreateSavings) {
    ctx.patchState({ loading: true });
    return this.savingsService.addSavings(payload).pipe(
      tap((res: any) => {
        const state = ctx.getState();
        ctx.patchState({
          savings: {
            data: [...state.savings.data, res.data],
            total: state.savings.total + 1,
          },
          response: res,
        });
      }),
      finalize(() => ctx.patchState({ loading: false })),
      map((res: any) => res) // ✅ this returns the real API response to your component
    );
  }

  @Action(UpdateSavings)
  update(ctx: StateContext<SavingsStateModel>, { payload, id }: UpdateSavings) {
    ctx.patchState({ loading: true });
    return this.savingsService.updateSavings(payload, id).pipe(
      tap({
        next: (res: any) => {
          const state = ctx.getState();
          const updatedSaving = res.data;
          const updatedSavings = state.savings.data.map((saving: any) =>
            saving.id === id ? updatedSaving : saving
          );
          const selectedSavings =
            state.selectedSavings?.id === id
              ? updatedSaving
              : state.selectedSavings;

          ctx.patchState({
            ...state,
            savings: {
              data: updatedSavings,
              total: state.savings.total,
            },
            selectedSavings,
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

  @Action(DeleteSaving)
  deleteUser(ctx: StateContext<SavingsStateModel>, { id }: DeleteSaving) {
    ctx.patchState({ loading: true });
    return this.savingsService.deleteSavings(id).pipe(
      tap((res) => {
        const state = ctx.getState();
        const filteredSavings = state.savings.data.filter(
          (saving) => saving.id !== id
        );
        ctx.patchState({
          ...state,
          member: {
            data: filteredSavings,
            total: state.savings.total - 1,
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

  @Action(AddBatchSavings)
  addBatchSavings(
    ctx: StateContext<SavingsStateModel>,
    { payload }: AddBatchSavings
  ) {
    console.log("Batch data ::::::::", payload);
    return this.savingsService.uploadBatchSavings(payload).pipe(
      tap((result: any) => {
        ctx.patchState({
          response: result,
        });
      }),
      finalize(() => ctx.patchState({ loading: false })),
      map((res: any) => res) // ✅ this returns the real API response to your component
    );
  }

  @Action(GenerateSavingsTemplate)
  generateSavingsTemplate(
    ctx: StateContext<SavingsStateModel>,
    { payload }: GenerateSavingsTemplate
  ) {
    ctx.patchState({ loading: true });
    return this.excelService.generateSavingsTemplate().pipe(
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

  @Action(ExportSavings)
  exportSavings(
    ctx: StateContext<SavingsStateModel>,
    { customData }: ExportSavings
  ) {
    const state = ctx.getState();
    ctx.patchState({ loading: true });

    let savingsToExport: any[] = [];

    if (customData && customData.length > 0) {
      savingsToExport = customData;
    } else {
      savingsToExport = state.savings.data;
    }

    if (!savingsToExport || savingsToExport.length === 0) {
      ctx.patchState({ loading: false });
      this.notificationService.showError(`No Savings data available to export`);
    }

    return this.savingsExcelService.exportSavingsToExcel(savingsToExport).pipe(
      tap(() => {
        ctx.patchState({ loading: false });
      }),
      catchError((err) => {
        ctx.patchState({ loading: false });
        console.error("Error exporting savings:", err);
        return throwError(() => err);
      })
    );
  }
}
