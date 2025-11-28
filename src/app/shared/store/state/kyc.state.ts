import { Injectable } from "@angular/core";
import { State, Action, StateContext, Selector } from "@ngxs/store";
import { tap, catchError, throwError } from "rxjs";
import { DeleteKYC, GetKYCSubmissions, UpdateKYCStatus } from "../action/kyc.action";
import { KYCService } from "src/app/core/services/kyc.service";

export interface KYCStateModel {
  submissions: any[];
  loading: boolean;
  response?: any;
}

@State<KYCStateModel>({
  name: "kyc",
  defaults: {
    submissions: [],
    loading: false,
  },
})
@Injectable()
export class KYCState {
  constructor(private kycService: KYCService) {}

   @Selector()
  static submissions(state: KYCStateModel) {
    return state.submissions;
  }

  @Selector()
  static loading(state: KYCStateModel) {
    return state.loading;
  }
  @Action(GetKYCSubmissions)
  getSubmissions(ctx: StateContext<KYCStateModel>, { payload }: GetKYCSubmissions) {
    ctx.patchState({ loading: true });
    
    return this.kycService.getKYCSubmissions(payload).pipe(
      tap((res: any) => {
        ctx.patchState({
          submissions: res.data,
          loading: false,
        });
      }),
      catchError(err => {
        ctx.patchState({ loading: false });
        return throwError(() => err);
      })
    );
  }

  @Action(UpdateKYCStatus)
  updateStatus(ctx: StateContext<KYCStateModel>, { id, payload }: UpdateKYCStatus) {
    return this.kycService.updateKYCStatus(id, payload).pipe(
      tap((res:any) => {
        const state = ctx.getState();
        const updated = state.submissions.map(s =>
          s.id === id ? { ...s, ...payload } : s
        );

        ctx.patchState({ submissions: updated,loading:false,response:res });
      })
    );
  }

  @Action(DeleteKYC)
  delete(ctx: StateContext<KYCStateModel>, { id }: DeleteKYC) {
    
    return this.kycService.deleteKYC(id).pipe(
      tap((res:any) => {
        const state = ctx.getState();
        ctx.patchState({
          submissions: state.submissions.filter(s => s.id !== id),
          loading: false,
          response: res 
        });
      })
    );
  }
}
