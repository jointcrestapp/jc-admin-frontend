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
  SetLoadingState,
  GetByeLaws,
  EditByeLaw,
  UpdateByeLaw,
  CreateByeLaw,
  DeleteByeLaw,
  GetMinutes,
  EditMinute,
  CreateMinute,
  UpdateMinute,
  DeleteMinute,
  GetTrainingSeminar,
  EditTrainingSeminar,
  CreateTrainingSeminar,
  UpdateTrainingSeminar,
  DeleteTrainingSeminar,
} from "../action/miscellaneous.action";
import { MiscellaneousService } from "../../../core/services/miscellanious.service";

export interface MiscellaneousStateModel {
  bye_law: {
    data: any[];
    total: any | null;
  };
  loading?: boolean;
  selectedByeLaw?: any | null;
  minute: {
    data: any[];
    total: any | null;
  };
  selectedMinute?: any | null;
  training_seminar: {
    data: any[];
    total: any | null;
  };
  selectedTrainingSeminar?: any | null;
  response?: any | null;
}

@State<MiscellaneousStateModel>({
  name: "miscellaneous",
  defaults: {
    bye_law: {
      data: [],
      total: 0,
    },
    minute: {
      data: [],
      total: 0,
    },
    training_seminar: {
      data: [],
      total: 0,
    },
    loading: false,
    selectedByeLaw: null,
    selectedMinute: null,
    selectedTrainingSeminar: null,
  },
})
@Injectable()
export class MiscellaneousState {
  constructor(private miscellaneousService: MiscellaneousService) {}

  @Selector()
  static isLoading(state: MiscellaneousStateModel) {
    return state.loading;
  }

  @Selector()
  static byeLaw(state: MiscellaneousStateModel) {
    return state.bye_law;
  }

  @Selector()
  static selectedByeLaw(state: MiscellaneousStateModel) {
    return state.selectedByeLaw;
  }

  @Selector()
  static minute(state: MiscellaneousStateModel) {
    return state.minute;
  }

  @Selector()
  static selectedMinute(state: MiscellaneousStateModel) {
    return state.selectedMinute;
  }

  @Selector()
  static training_seminar(state: MiscellaneousStateModel) {
    return state.training_seminar;
  }

  @Selector()
  static selectedTrainingSeminar(state: MiscellaneousStateModel) {
    return state.selectedTrainingSeminar;
  }

  @Action(SetLoadingState)
  setLoading(
    ctx: StateContext<MiscellaneousStateModel>,
    { isLoading }: SetLoadingState
  ) {
    ctx.patchState({ loading: isLoading });
  }

  @Action(GetByeLaws)
  getShares(
    ctx: StateContext<MiscellaneousStateModel>,
    { payload }: GetByeLaws
  ) {
    ctx.patchState({ loading: true });

    return this.miscellaneousService.getByeLaws(payload).pipe(
      tap((result: any) => {
        ctx.patchState({
          bye_law: {
            data: result.data,
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
        console.error("Error fetching bye laws:", err);
        return throwError(() => err);
      })
    );
  }

  @Action(EditByeLaw)
  editByeLaw(ctx: StateContext<MiscellaneousStateModel>, { id }: EditByeLaw) {
    ctx.patchState({ loading: true });

    return this.miscellaneousService.getByeLaws({}).pipe(
      tap((results: any) => {
        const bye_law = results.data.find((bl: any) => bl.id == id);
        ctx.patchState({
          selectedByeLaw: bye_law || null,
        });
      }),
      finalize(() => ctx.patchState({ loading: false }))
    );
  }

  @Action(CreateByeLaw)
  createByeLaw(
    ctx: StateContext<MiscellaneousStateModel>,
    { payload }: CreateByeLaw
  ) {
    ctx.patchState({ loading: true });
    const state = ctx.getState();

    return this.miscellaneousService.addByeLaw(payload).pipe(
      tap((res: any) => {
        ctx.patchState({
          bye_law: {
            data: [...state.bye_law.data, res.data],
            total: state.bye_law.total + 1,
          },
          response: res,
        });
      }),
      finalize(() => ctx.patchState({ loading: false })),
      map((res: any) => res) // ✅ this returns the real API response to your component
    );
  }

  @Action(UpdateByeLaw)
  updateByeLaw(
    ctx: StateContext<MiscellaneousStateModel>,
    { payload, id }: UpdateByeLaw
  ) {
    ctx.patchState({ loading: true });
    return this.miscellaneousService.updateByeLaw(payload, id).pipe(
      tap({
        next: (res: any) => {
          const state = ctx.getState();
          const updatedByeLaw = res.data;
          const updatedByeLaws = state.bye_law.data.map((bl: any) =>
            bl.id === id ? updatedByeLaw : bl
          );
          const selectedByeLaw =
            state.selectedByeLaw?.id === id
              ? updatedByeLaw
              : state.selectedByeLaw;

          ctx.patchState({
            bye_law: {
              data: updatedByeLaws,
              total: state.bye_law.total,
            },
            selectedByeLaw,
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

  @Action(DeleteByeLaw)
  deleteByeLaw(
    ctx: StateContext<MiscellaneousStateModel>,
    { id }: DeleteByeLaw
  ) {
    ctx.patchState({ loading: true });
    return this.miscellaneousService.deleteByeLaw(id).pipe(
      tap((res) => {
        const state = ctx.getState();
        const filteredByeLaws = state.bye_law.data.filter((bl) => bl.id !== id);
        ctx.patchState({
          bye_law: {
            data: filteredByeLaws,
            total: state.bye_law.total - 1,
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

  @Action(GetMinutes)
  getMinutes(
    ctx: StateContext<MiscellaneousStateModel>,
    { payload }: GetMinutes
  ) {
    ctx.patchState({ loading: true });

    return this.miscellaneousService.getMinutes(payload).pipe(
      tap((result: any) => {
        ctx.patchState({
          minute: {
            data: result.data,
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
        console.error("Error fetching minutes:", err);
        return throwError(() => err);
      })
    );
  }

  @Action(EditMinute)
  editUser(ctx: StateContext<MiscellaneousStateModel>, { id }: EditMinute) {
    ctx.patchState({ loading: true });

    return this.miscellaneousService.getMinutes({}).pipe(
      tap((results: any) => {
        const minute = results.data.find((mins: any) => mins.id == id);
        ctx.patchState({
          selectedMinute: minute || null,
        });
      }),
      finalize(() => ctx.patchState({ loading: false }))
    );
  }

  @Action(CreateMinute)
  createMinute(
    ctx: StateContext<MiscellaneousStateModel>,
    { payload }: CreateMinute
  ) {
    ctx.patchState({ loading: true });
    const state = ctx.getState();

    return this.miscellaneousService.addMinute(payload).pipe(
      tap((res: any) => {
        ctx.patchState({
          minute: {
            data: [...state.minute.data, res.data],
            total: state.minute.total + 1,
          },
          response: res,
        });
      }),
      finalize(() => ctx.patchState({ loading: false })),
      map((res: any) => res) // ✅ this returns the real API response to your component
    );
  }

  @Action(UpdateMinute)
  updateMinute(
    ctx: StateContext<MiscellaneousStateModel>,
    { payload, id }: UpdateMinute
  ) {
    ctx.patchState({ loading: true });
    return this.miscellaneousService.updateMinute(payload, id).pipe(
      tap({
        next: (res: any) => {
          const state = ctx.getState();
          const updatedMinute = res.data;
          const updatedMinutes = state.minute.data.map((mins: any) =>
            mins.id === id ? updatedMinute : mins
          );
          const selectedMinute =
            state.selectedMinute?.id === id
              ? updatedMinute
              : state.selectedMinute;

          ctx.patchState({
            minute: {
              data: updatedMinutes,
              total: state.minute.total,
            },
            selectedMinute,
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

  @Action(DeleteMinute)
  deleteMinute(
    ctx: StateContext<MiscellaneousStateModel>,
    { id }: DeleteMinute
  ) {
    ctx.patchState({ loading: true });
    return this.miscellaneousService.deleteMinute(id).pipe(
      tap((res) => {
        const state = ctx.getState();
        const filteredMinutes = state.minute.data.filter(
          (mins) => mins.id !== id
        );
        ctx.patchState({
          minute: {
            data: filteredMinutes,
            total: state.minute.total - 1,
          },
          loading: false,
          response: res,
        });
      }),
      catchError((err) => {
        ctx.patchState({ loading: false });
        console.error("Error deleting minute:", err);
        return throwError(() => err);
      })
    );
  }

  @Action(GetTrainingSeminar)
  getTrainingSeminar(
    ctx: StateContext<MiscellaneousStateModel>,
    { payload }: GetTrainingSeminar
  ) {
    ctx.patchState({ loading: true });

    return this.miscellaneousService.getTrainingSeminar(payload).pipe(
      tap((result: any) => {
        ctx.patchState({
          training_seminar: {
            data: result.data,
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
        console.error("Error fetching training seminars:", err);
        return throwError(() => err);
      })
    );
  }

  @Action(EditTrainingSeminar)
  editTrainingSeminar(
    ctx: StateContext<MiscellaneousStateModel>,
    { id }: EditTrainingSeminar
  ) {
    ctx.patchState({ loading: true });

    return this.miscellaneousService.getTrainingSeminar({}).pipe(
      tap((results: any) => {
        const training_seminar = results.data.find((ts: any) => ts.id == id);
        ctx.patchState({
          selectedMinute: training_seminar || null,
        });
      }),
      finalize(() => ctx.patchState({ loading: false }))
    );
  }

  @Action(CreateTrainingSeminar)
  createTrainingSeminar(
    ctx: StateContext<MiscellaneousStateModel>,
    { payload }: CreateTrainingSeminar
  ) {
    ctx.patchState({ loading: true });
    const state = ctx.getState();

    return this.miscellaneousService.addTrainingSeminar(payload).pipe(
      tap((res: any) => {
        ctx.patchState({
          training_seminar: {
            data: [...state.training_seminar.data, res.data],
            total: state.training_seminar.total + 1,
          },
          response: res,
        });
      }),
      finalize(() => ctx.patchState({ loading: false })),
      map((res: any) => res) // ✅ this returns the real API response to your component
    );
  }

  @Action(UpdateTrainingSeminar)
  updateTrainingSeminar(
    ctx: StateContext<MiscellaneousStateModel>,
    { payload, id }: UpdateTrainingSeminar
  ) {
    ctx.patchState({ loading: true });
    return this.miscellaneousService.updateTrainingSeminar(payload, id).pipe(
      tap({
        next: (res: any) => {
          const state = ctx.getState();
          const updatedTrainingSeminar = res.data;
          const updatedTrainingSeminars = state.training_seminar.data.map(
            (ts: any) => (ts.id === id ? updatedTrainingSeminar : ts)
          );
          const selectedTrainingSeminar =
            state.selectedTrainingSeminar?.id === id
              ? updatedTrainingSeminar
              : state.selectedTrainingSeminar;

          ctx.patchState({
            training_seminar: {
              data: updatedTrainingSeminars,
              total: state.training_seminar.total,
            },
            selectedTrainingSeminar,
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

  @Action(DeleteTrainingSeminar)
  deleteTrainingSeminar(
    ctx: StateContext<MiscellaneousStateModel>,
    { id }: DeleteTrainingSeminar
  ) {
    ctx.patchState({ loading: true });
    return this.miscellaneousService.deleteTrainingSeminar(id).pipe(
      tap((res) => {
        const state = ctx.getState();
        const filteredTrainingSeminars = state.training_seminar.data.filter(
          (ts) => ts.id !== id
        );
        ctx.patchState({
          training_seminar: {
            data: filteredTrainingSeminars,
            total: state.training_seminar.total - 1,
          },
          loading: false,
          response: res,
        });
      }),
      catchError((err) => {
        ctx.patchState({ loading: false });
        console.error("Error deleting training seminars:", err);
        return throwError(() => err);
      })
    );
  }
}
