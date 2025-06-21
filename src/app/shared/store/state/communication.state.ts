import { Injectable } from "@angular/core";
import { Store, Action, Selector, State, StateContext } from "@ngxs/store";
import { catchError, finalize, map, tap, throwError } from "rxjs";
import { SendMessage } from "../action/communication.action";
import { COmmunicationService } from "src/app/core/services/communication.service";

export interface CommunicationStateModel {
  loading?: boolean;
  response?: any | null;
}

@State<CommunicationStateModel>({
  name: "communication",
  defaults: {
    loading: false,
    response: null,
  },
})
@Injectable()
export class CommunicationState {
  constructor(
    private store: Store,
    private communicationService: COmmunicationService
  ) {}

  @Selector()
  static isLoading(state: CommunicationStateModel) {
    return state.loading;
  }

  @Action(SendMessage)
  create(ctx: StateContext<CommunicationStateModel>, { payload }: SendMessage) {
    ctx.patchState({ loading: true });

    return this.communicationService.sendMessage(payload).pipe(
      tap((res: any) => {
        const state = ctx.getState();
        ctx.patchState({
          response: res,
        });
      }),
      finalize(() => ctx.patchState({ loading: false })),
      map((res: any) => res) // ✅ this returns the real API response to your component
    );
  }
}
