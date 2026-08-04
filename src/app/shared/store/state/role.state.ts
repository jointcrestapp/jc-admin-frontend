import { Injectable } from "@angular/core";
import { Store, Action, Selector, State, StateContext } from "@ngxs/store";
import { catchError, finalize, map, tap, throwError } from "rxjs";
import {
  GetRoles,
  GetRoleModules,
  CreateRole,
  EditRole,
  UpdateRole,
  DeleteRole,
  DeleteAllRole,
} from "../action/role.action";
import { RleService } from "src/app/core/services/role.service";
import { NotificationService } from "../../services/notification.service";

export interface RoleStateModel {
  role: any[];
  loading?: boolean;
  selectedRole: any | null;
  response?: any;
  modules: any[];
}

@State<RoleStateModel>({
  name: "role",
  defaults: {
    role: [],
    loading: false,
    selectedRole: null,
    response: null,
    modules: [],
  },
})
@Injectable()
export class RoleState {
  constructor(
    private rleService: RleService
  ) {}

  @Selector()
  static role(state: RoleStateModel) {
    return state.role;
  }

  @Selector()
  static roles(state: RoleStateModel) {
    return state.role
      .map((res) => {
        return { label: res?.name, value: res?.id };
      })
      .filter((value) => value.label !== "admin" && value.label !== "vendor");
  }

  @Selector()
  static selectedRole(state: RoleStateModel) {
    return state.selectedRole;
  }

  @Selector()
  static isLoading(state: RoleStateModel) {
    return state.loading;
  }

  @Selector()
  static roleModules(state: RoleStateModel) {
    return state.modules;
  }

  @Action(GetRoles)
  getRoles(ctx: StateContext<RoleStateModel>, { payload }: GetRoles) {
    ctx.patchState({ loading: true });
    return this.rleService.getRoles(payload).pipe(
      tap((result) => {
        ctx.patchState({
          role: result.data,
          loading: false,
        });
      }),
      catchError((err) => {
        ctx.patchState({ loading: false });
        console.error("Error fetching roles:", err);
        return throwError(() => err);
      })
    );
  }
  @Action(GetRoleModules)
  getRoleModules(ctx: StateContext<RoleStateModel>) {
    ctx.patchState({ loading: true });
    return this.rleService.getRoleModules().pipe(
      tap({
        next: (result) => {
          ctx.patchState({
            modules: result?.data || [],
            loading: false,
          });
        },
        error: (err) => {
          ctx.patchState({ loading: false });
          throw new Error(err?.error?.message);
        },
      })
    );
  }
  @Action(CreateRole)
  create(ctx: StateContext<RoleStateModel>, { payload }: CreateRole) {
    ctx.patchState({ loading: true });
    return this.rleService.addRole(payload).pipe(
      tap((res: any) => {
        const state = ctx.getState();
        ctx.patchState({
          role: [...state.role, res.data],
          response: res, // Optionally set the newly created role as selected
        });
      }),
      finalize(() => ctx.patchState({ loading: false })),
      map((res: any) => res) // ✅ this returns the real API response to your component
    );
  }
  @Action(EditRole)
  edit(ctx: StateContext<RoleStateModel>, { id }: EditRole) {
    ctx.patchState({ loading: true });
    return this.rleService.getRoles({}).pipe(
      tap((results: any) => {
        const state = ctx.getState();
        const result = results.data.find((role: any) => role.id == id);
        ctx.patchState({
          selectedRole: result,
        });
      }),
      finalize(() => ctx.patchState({ loading: false }))
    );
  }
  @Action(UpdateRole)
  update(ctx: StateContext<RoleStateModel>, { payload, id }: UpdateRole) {
    ctx.patchState({ loading: true });

    return this.rleService.updateRole(payload, id).pipe(
      tap({
        next: (res: any) => {
          const state = ctx.getState();
          const updatedRole = res.data;
          const updatedData = state.role.map((role) =>
            role.id === id ? { ...role, ...payload } : role
          );
          const selectedRole =
            state.selectedRole?.id === id ? updatedRole : state.selectedRole;

          ctx.patchState({
            role: updatedData,
            selectedRole,
            response: res,
          });
        },
        error: (err) => {
          throw new Error(err?.error?.message || "Update failed");
        },
      })
    );
  }
  @Action(DeleteRole)
  deleteRole(ctx: StateContext<RoleStateModel>, { id }: DeleteRole) {
    ctx.patchState({ loading: true });
    return this.rleService.deleteRole(id).pipe(
      tap((res) => {
        const state = ctx.getState();
        const filteredRoles = state.role.filter((role) => role.id !== id);
        ctx.patchState({
          role: filteredRoles,
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
  @Action(DeleteAllRole)
  deleteAllRoles(ctx: StateContext<RoleStateModel>, { ids }: DeleteAllRole) {
    ctx.patchState({ loading: true });
    return this.rleService.deleteMultipleRoles(ids).pipe(
      tap(() => {
        const state = ctx.getState();
        const remainingRoles = state.role.filter(
          (role) => !ids.includes(role.id)
        );
        ctx.patchState({
          role: remainingRoles,
          loading: false,
        });
      }),
      catchError((err) => {
        ctx.patchState({ loading: false });
        console.error("Error deleting multiple roles:", err);
        return throwError(() => err);
      })
    );
  }
}
