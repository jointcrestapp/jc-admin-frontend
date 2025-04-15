import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { catchError, finalize, map, tap, throwError } from "rxjs";
import { GetUsers, CreateUser, EditUser, UpdateUser, 
          UpdateUserStatus, DeleteUser, DeleteAllUser, 
          CreateUserAddress, ImportUser, ExportUser, 
          DeactivateUser,
          SetLoadingState,
          LoginSuccess,
          Logout} from "../action/user.action";
import { UserService } from "../../../core/services/user.service";
import { appConfig } from "src/app/core/config/config";
import { NotificationService } from "../../services/notification.service";

/* export class UserStateModel {
  user = {
    data: [] as any,
    total: 0
  }
  selectedUser: any | null;
}

@State<UserStateModel>({
  name: "user",
  defaults: {
    user: {
      data: [],
      total: 0
    },
    selectedUser: null
  },
})
*/
  
export interface UserStateModel {
  user: any[];
  loading?:boolean;
  selectedUser?: any | null;
  response?: any;
  token: string | null;
}

@State<UserStateModel>({
  name: "user",
  defaults: {
    user: [],
    loading: false,
    selectedUser: null,
    token: null
  },
})

@Injectable()
export class UserState {
  
  constructor(private userService: UserService,
    private notificationService : NotificationService
  ) {}

  @Selector()
  static token(state: UserStateModel): string | null {
    return state.token;
   }
  @Selector()
  static isAuthenticated(state: UserStateModel): boolean {
    return !!state.token && !!state.user;
  }

  @Selector()
  static isLoading(state: UserStateModel) {
    return state.loading;
  }
  
  @Selector()
  static user(state: UserStateModel) {
    return state.user;
  }

  @Selector()
  static users(state: UserStateModel) {
    return state.user.map(user => {
      return { label: user?.fname, value: user?.id }
    });
  }

  @Selector()
  static selectedUser(state: UserStateModel) {
    return state.selectedUser;
  }



  @Action(LoginSuccess)
  loginSuccess(ctx: StateContext<UserStateModel>, action: LoginSuccess) {
    const { token, user } = action.payload;
    ctx.setState({ token, user });
  }

  @Action(Logout)
  logout(ctx: StateContext<UserStateModel>) {
    ctx.setState({
      token: null,
      user: null
    });
  }
 @Action(SetLoadingState)
  setLoading(ctx: StateContext<UserStateModel>, { isLoading }: SetLoadingState) {
    ctx.patchState({ loading: isLoading });
 }
  
@Action(GetUsers)
getUsers(ctx: StateContext<UserStateModel>, { payload }: GetUsers) {
  ctx.patchState({ loading: true });

  return this.userService.getUsers(payload).pipe(
    tap((result: any) => {
      const users = (result?.data || []).map((element: any) => {
        element.role_name = element?.account_type == 4 ? 'Super Admin' : 'Admin';
        element.name = element?.first_name + ' ' + element?.last_name;
        element.status = element?.is_activated == 1 ? 1 : 0;
        return element;
      });

      ctx.patchState({
        user: users,
        loading: false
      });
    }),
    catchError((err) => {
      ctx.patchState({ loading: false });
      console.error('Error fetching users:', err);
      return throwError(() => err);
    })
  );
}

@Action(CreateUser)
create(ctx: StateContext<UserStateModel>, { payload }: CreateUser) {
  ctx.patchState({ loading: true });

  return this.userService.addUser(payload).pipe(
    tap((res: any) => {
      const state = ctx.getState();
      ctx.patchState({
        user: [...state.user, res.data],
        response: res 
      });
    }),
    finalize(() => ctx.patchState({ loading: false })),
    map((res: any) => res) // ✅ this returns the real API response to your component
  );
}


@Action(EditUser)
editUser(ctx: StateContext<UserStateModel>, { id }: EditUser) {
  ctx.patchState({ loading: true });

  return this.userService.getUsers({}).pipe(
    tap((results: any) => {
      const user = results.data.find((u: any) => u.id == id);
      ctx.patchState({
        selectedUser: user || null
      });
    }),
    finalize(() => ctx.patchState({ loading: false }))
  );
}

@Action(UpdateUser)
update(ctx: StateContext<UserStateModel>, { payload, id }: UpdateUser) {
  ctx.patchState({ loading: true });

  payload.user_id = id;
  return this.userService.updateUser(payload).pipe(
    tap({
      next: (res: any) => {
        const state = ctx.getState();
        const updatedUser = res.data;
        const updatedUsers = state.user.map(user =>
          user.id === id ? updatedUser : user
        );
        const selectedUser = state.selectedUser?.id === id ? updatedUser : state.selectedUser;

        ctx.patchState({
          user: updatedUsers,
          selectedUser,
          response:res
        });
      },
      error: err => {
        throw new Error(err?.error?.message || 'Update failed');
      }
    }),
    finalize(() => ctx.patchState({ loading: false }))
  );
}


@Action(UpdateUserStatus)
updateStatus(ctx: StateContext<UserStateModel>, { id, status }: UpdateUserStatus) {
  ctx.patchState({ loading: true });
  let payload = {
    user_id: id,
    status:status
  }
  return this.userService.updateUserStatus(payload).pipe(
    tap((res: any) => {
      const state = ctx.getState();
      const updatedUsers = state.user.map(user =>
        user.id === id ? { ...user, status } : user
      );

      ctx.patchState({
        user: updatedUsers,
        loading: false,
        response:res
      });
    }),
    catchError((err) => {
      ctx.patchState({ loading: false });
      console.error('Error updating user status:', err);
      return throwError(() => err);
    })
  );
}

@Action(DeleteUser)
deleteUser(ctx: StateContext<UserStateModel>, { id }: DeleteUser) {
  ctx.patchState({ loading: true });
  let payload:any = {};
  payload.user_id = id;
  return this.userService.deleteUser(payload).pipe(
    tap((res) => {
      const state = ctx.getState();
      const filteredUsers = state.user.filter(user => user.id !== id);
      ctx.patchState({
        user: filteredUsers,
        loading: false,
        response:res
      });
    }),
    catchError((err) => {
      ctx.patchState({ loading: false });
      console.error('Error deleting user:', err);
      return throwError(() => err);
    })
  );
}

@Action(DeleteAllUser)
deleteAllUsers(ctx: StateContext<UserStateModel>, { ids }: DeleteAllUser) {
  ctx.patchState({ loading: true });

  return this.userService.deleteMultipleUsers(ids).pipe(
    tap(() => {
      const state = ctx.getState();
      const remainingUsers = state.user.filter(user => !ids.includes(user.id));
      ctx.patchState({
        user: remainingUsers,
        loading: false
      });
    }),
    catchError((err) => {
      ctx.patchState({ loading: false });
      console.error('Error deleting multiple users:', err);
      return throwError(() => err);
    })
  );
}


  @Action(ImportUser)
  import(ctx: StateContext<UserStateModel>, action: ImportUser) {
    // Import User Logic Here
  }

  @Action(ExportUser)
  export(ctx: StateContext<UserStateModel>, action: ExportUser) {
    // Export User Logic Here
  }

  @Action(CreateUserAddress)
  createUserAddress(ctx: StateContext<UserStateModel>, action: CreateUserAddress) {
    // Create User Address Logic Here
  }

}
