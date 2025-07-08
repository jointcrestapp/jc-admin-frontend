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
  GetThrifts,
  SetLoadingState,
  GetFilteredMembers,
  EditThrifts,
  CreateThrifts,
  UpdateThrifts,
  DeleteThrifts,
  GetThriftsTiers,
  GetThriftsCategories,
  GetActiveThriftForUser,
  GenerateThriftTemplate,
  AddBatchThrifts,
} from "../action/thrift.action";
import { ThriftsService } from "src/app/core/services/thrift.service";
import { ExcelService } from "src/app/core/services/excel.service";

export interface ThriftsStateModel {
  thrifts: {
    data: any[];
    total: any | null;
  };
  loading?: boolean;
  selectedThrifts?: any | null;
  response?: any | null;
  statistics?: any | null;
  member?: any | null;
  tiers?: any[];
  categories?: any[];
  is_active?: boolean;
  thrift_tier?: any | null;
}

@State<ThriftsStateModel>({
  name: "thrifts",
  defaults: {
    thrifts: {
      data: [],
      total: 0,
    },
    loading: false,
    selectedThrifts: null,
    statistics: null,
    member: null,
    tiers: [],
    categories: [],
    is_active: false,
    thrift_tier: null,
  },
})
@Injectable()
export class ThriftsState {
  constructor(
    private thriftsService: ThriftsService,
    private excelService: ExcelService
  ) {}

  @Selector()
  static isLoading(state: ThriftsStateModel) {
    return state.loading;
  }

  @Selector()
  static thrifts(state: ThriftsStateModel) {
    return state.thrifts;
  }

  @Selector()
  static thrift_tier(state: ThriftsStateModel) {
    return state.thrift_tier;
  }

  @Selector()
  static activeThrift(state: ThriftsStateModel) {
    return state.is_active;
  }

  @Selector()
  static member(state: ThriftsStateModel) {
    return state.member;
  }

  @Selector()
  static tiers(state: ThriftsStateModel) {
    return state.tiers;
  }

  @Selector()
  static categories(state: ThriftsStateModel) {
    return state.categories;
  }

  @Selector()
  static selectedThrifts(state: ThriftsStateModel) {
    return state.selectedThrifts;
  }

  @Selector()
  static statistics(state: ThriftsStateModel) {
    return state.statistics;
  }

  @Action(SetLoadingState)
  setLoading(
    ctx: StateContext<ThriftsStateModel>,
    { isLoading }: SetLoadingState
  ) {
    ctx.patchState({ loading: isLoading });
  }

  @Action(GetThrifts)
  getThrifts(ctx: StateContext<ThriftsStateModel>, { payload }: GetThrifts) {
    const state = ctx.getState();
    ctx.patchState({ loading: true });

    return this.thriftsService.getThrifts(payload).pipe(
      tap((result: any) => {
        const thrifts = (result?.data || []).map((element: any) => {
          element.user_country = Number(element.user_country);
          return element;
        });
        ctx.patchState({
          thrifts: {
            data: thrifts,
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

  @Action(GetActiveThriftForUser)
  getActiveThrift(
    ctx: StateContext<ThriftsStateModel>,
    { payload }: GetActiveThriftForUser
  ) {
    ctx.patchState({ loading: true });

    return this.thriftsService.getActiveThriftForUser(payload).pipe(
      tap((result: any) => {
        ctx.patchState({
          is_active: result.isActive,
          response: result,
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
    ctx: StateContext<ThriftsStateModel>,
    { payload }: GetFilteredMembers
  ) {
    const state = ctx.getState();
    ctx.patchState({ loading: true });

    return this.thriftsService.getFilteredMember(payload).pipe(
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

  @Action(EditThrifts)
  editThrifts(ctx: StateContext<ThriftsStateModel>, { id }: EditThrifts) {
    const state = ctx.getState();
    ctx.patchState({ loading: true });

    return this.thriftsService.getThrifts({}).pipe(
      tap((results: any) => {
        const savings = results.data.find((s: any) => s.id == id);
        ctx.patchState({
          selectedThrifts: savings || null,
        });
      }),
      finalize(() => ctx.patchState({ loading: false }))
    );
  }

  @Action(CreateThrifts)
  createThrifts(
    ctx: StateContext<ThriftsStateModel>,
    { payload }: CreateThrifts
  ) {
    const state = ctx.getState();
    ctx.patchState({ loading: true });

    return this.thriftsService.addThrifts(payload).pipe(
      tap((res: any) => {
        console.log("Res ::::::", res);
        const state = ctx.getState();
        ctx.patchState({
          thrifts: {
            data: [...state.thrifts.data, res.data],
            total: state.thrifts.total + 1,
          },
          response: res,
        });
      }),
      finalize(() => ctx.patchState({ loading: false })),
      map((res: any) => res) // ✅ this returns the real API response to your component
    );
  }

  @Action(UpdateThrifts)
  updateThrifts(
    ctx: StateContext<ThriftsStateModel>,
    { payload, id }: UpdateThrifts
  ) {
    ctx.patchState({ loading: true });
    return this.thriftsService.updateThrifts(payload, id).pipe(
      tap({
        next: (res: any) => {
          const state = ctx.getState();
          const updatedThrift = res.data;
          const updatedThrifts = state.thrifts.data.map((saving: any) =>
            saving.id === id ? updatedThrift : saving
          );
          const selectedThrifts =
            state.selectedThrifts?.id === id
              ? updatedThrift
              : state.selectedThrifts;

          ctx.patchState({
            thrifts: {
              data: updatedThrifts,
              total: state.thrifts.total,
            },
            selectedThrifts,
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

  @Action(DeleteThrifts)
  deleteThrifts(ctx: StateContext<ThriftsStateModel>, { id }: DeleteThrifts) {
    ctx.patchState({ loading: true });
    return this.thriftsService.deleteThrifts(id).pipe(
      tap((res) => {
        const state = ctx.getState();
        const filteredThrifts = state.thrifts.data.filter(
          (thrift) => thrift.id !== id
        );
        ctx.patchState({
          member: {
            data: filteredThrifts,
            total: state.thrifts.total - 1,
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

  @Action(GetThriftsTiers)
  getThriftsTiers(
    ctx: StateContext<ThriftsStateModel>,
    { payload }: GetThriftsTiers
  ) {
    const state = ctx.getState();
    ctx.patchState({ loading: true });

    return this.thriftsService.getThriftsTiers(payload).pipe(
      tap((result: any) => {
        ctx.patchState({
          tiers: result?.data,
          loading: false,
        });
      }),
      catchError((err) => {
        ctx.patchState({ loading: false });
        console.error("Error fetching thrifts tiers:", err);
        return throwError(() => err);
      })
    );
  }

  @Action(GetThriftsCategories)
  getThriftsCategories(
    ctx: StateContext<ThriftsStateModel>,
    { id }: GetThriftsCategories
  ) {
    const state = ctx.getState();
    ctx.patchState({ loading: true });

    return this.thriftsService.getThriftsTiers({}).pipe(
      tap((result: any) => {
        let cats = result?.data.find((cat: any) => cat.value === id);
        console.log("Categories ::::::::::::::::", cats);
        let thrift_tier = cats.label;
        cats = cats.categories.map((category: any) => ({
          value: category.id,
          label: category.meta,
          amount: cats.amount,
          currency: cats.currency,
          members_allowed: category.members_allowed,
          duration: category.duration,
          available_slots:
            Number(category.members_allowed) - category.thrift_count,
        }));
        ctx.patchState({
          thrift_tier,
          categories: cats,
          loading: false,
        });
      }),
      catchError((err) => {
        ctx.patchState({ loading: false });
        console.error("Error fetching thrifts categories:", err);
        return throwError(() => err);
      })
    );
  }

  @Action(GenerateThriftTemplate)
  generateThriftsTemplate(
    ctx: StateContext<ThriftsStateModel>,
    { payload }: GenerateThriftTemplate
  ) {
    ctx.patchState({ loading: true });
    return this.excelService.generateThriftsTemplate().pipe(
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

  @Action(AddBatchThrifts)
  addBatchThrifts(
    ctx: StateContext<ThriftsStateModel>,
    { payload }: AddBatchThrifts
  ) {
    console.log("Batch data ::::::::", payload);
    return this.thriftsService.uploadBatchThrifts(payload).pipe(
      tap((result: any) => {
        ctx.patchState({
          response: result,
        });
      }),
      finalize(() => ctx.patchState({ loading: false })),
      map((res: any) => res) // ✅ this returns the real API response to your component
    );
  }
}
