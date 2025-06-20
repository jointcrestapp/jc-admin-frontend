import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { tap } from "rxjs";
import { GetCountries, GetStates } from "../action/country.action";
import { Country } from "../../interface/country.interface";
import { CountryService } from "../../services/country.service";

export interface CountryStateModel {
  country: any[],
  state: any[]
}

@State<CountryStateModel>({
  name: "country",
  defaults: {
    country: [],
    state: []
  },
})
@Injectable()
export class CountryState {
  
  constructor(private countryService: CountryService) {}

  @Selector()
  static country(state: CountryStateModel) {
    return state.country;
  }

  @Selector()
  static countries(state: CountryStateModel) {
    return state?.country?.map(cn => {
      return { label: cn?.name, value: cn?.id }
    });
  }

  @Selector()
  static states(state: CountryStateModel) {
    return state?.state?.map(st => {
      return { label: st?.name, value: st?.id }
    })
  }

  @Action(GetCountries)
  getCountries(ctx: StateContext<CountryStateModel>, action: GetCountries) {
    const state = ctx.getState();
    if (state?.country?.length) {
      // If the country has been already loaded
      // we just break the execution
      return true;
    }
    return this.countryService.getCountries().pipe(
      tap({
        next: result => { 
          // console.log("Countries >>>>>>>>>.", result);
          ctx.patchState({
            ...state,
            country: result,
          });
        },
        error: err => { 
          throw new Error(err?.error?.message);
        }
      })
    );
  }

  @Action(GetStates)
  getStates(ctx: StateContext<CountryStateModel>, { id }: GetStates) {
    const state = ctx.getState();
    
    return this.countryService.getCountries().pipe(
      tap((results: any) => {
        const state = ctx.getState();
        const country = results.find((cn: any) => cn.id == id);
        ctx.patchState({
          ...state,
          state: country?.state
        })
      })
    );
  }

}
