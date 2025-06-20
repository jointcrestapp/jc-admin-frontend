import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { catchError, finalize, map, tap, throwError } from "rxjs";
import { COnfigurationsService } from "../../../core/services/configurations.service";
import {
  SetLoadingState,
  GetCurrencies,
  EditCurrency,
  UpdateCurrency,
  EditSubscriptionFee,
  GetSubscriptionFees,
  UpdateSubscriptionFee,
  GetSharesAmount,
  EditShareAmount,
  UpdateShareAmount,
  GetThriftCategories,
  EditThriftCategory,
  CreateThriftCategory,
  UpdateThriftCategory,
  DeleteThriftCategory,
  GetThriftTiers,
  EditThriftTier,
  CreateThriftTier,
  UpdateThriftTier,
  DeleteThriftTier,
  GetInvestmentTypes,
  EditInvestmentType,
  CreateInvestmentType,
  UpdateInvestmentType,
  DeleteInvestmentType,
  GetVendors,
  EditVendor,
  CreateVendor,
  UpdateVendor,
  DeleteVendor,
  GetProductPlans,
  EditProductPlan,
  CreateProductPlan,
  UpdateProductPlan,
  DeleteProductPlan,
  GetProducts,
  EditProduct,
  CreateProduct,
  UpdateProduct,
  DeleteProduct,
  DeleteLoanType,
  UpdateLoanType,
  CreateLoanType,
  EditLoanType,
  GetLoanTypes,
  GetSharesTypes,
  EditSharesType,
  CreateSharesType,
  UpdateSharesType,
  UpdateSharesTypeStatus,
  GetSavingsTypes,
  EditSavingsType,
  CreateSavingsType,
  UpdateSavingsType,
  UpdateSavingsTypeStatus,
  GetUserRoles,
  EditUserRole,
  CreateUserRole,
  UpdateUserRole,
  DeleteUserRole,
} from "../action/configurations.action";

export interface ConfigurationsStateModel {
  currency?: {
    data: any[];
    total: any | null;
  };
  loading?: boolean;
  selectedCurrency?: any | null;
  response?: any | null;
  SelectedSubscriptionFee?: any | null;
  subscription_fee?: {
    data: any[];
    total: any | null;
  };
  shares_amount?: {
    data: any[];
    total: any | null;
  };
  SelectedShareAmount?: any | null;
  thrift_categories?: {
    data: any[];
    total: any | null;
  };
  SelectedThriftCategory?: any | null;
  thrift_tiers?: {
    data: any[];
    total: any | null;
  };
  SelectedThriftTier?: any | null;
  investment_types?: {
    data: any[];
    total: any | null;
  };
  SelectedInvestmentType?: any | null;
  vendors?: {
    data: any[];
    total: any | null;
  };
  SelectedVendor?: any | null;
  product_plans?: {
    data: any[];
    total: any | null;
  };
  SelectedProductPlan?: any | null;
  products?: {
    data: any[];
    total: any | null;
  };
  SelectedProduct?: any | null;
  loan_types?: {
    data: any[];
    total: any | null;
  };
  SelectedLoanType?: any | null;
  share_types?: {
    data: any[];
    total: any | null;
  };
  SelectedShareType?: any | null;
  savings_types?: {
    data: any[];
    total: any | null;
  };
  SelectedSavingsType?: any | null;
  user_roles?: {
    data: any[];
    total: any | null;
  };
  SelectedUserRole?: any | null;
}

@State<ConfigurationsStateModel>({
  name: "configurations",
  defaults: {
    loading: false,
    selectedCurrency: null,
    currency: {
      data: [],
      total: 0,
    },
    subscription_fee: {
      data: [],
      total: 0,
    },
    SelectedSubscriptionFee: null,
    shares_amount: {
      data: [],
      total: 0,
    },
    SelectedShareAmount: null,
    thrift_categories: {
      data: [],
      total: 0,
    },
    SelectedThriftCategory: null,
    thrift_tiers: {
      data: [],
      total: 0,
    },
    SelectedThriftTier: null,
    investment_types: {
      data: [],
      total: 0,
    },
    SelectedInvestmentType: null,
    vendors: {
      data: [],
      total: 0,
    },
    SelectedVendor: null,
    product_plans: {
      data: [],
      total: 0,
    },
    SelectedProductPlan: null,
    products: {
      data: [],
      total: 0,
    },
    SelectedProduct: null,
    loan_types: {
      data: [],
      total: 0,
    },
    SelectedLoanType: null,
    share_types: {
      data: [],
      total: 0,
    },
    SelectedShareType: null,
    savings_types: {
      data: [],
      total: 0,
    },
    SelectedSavingsType: null,
    user_roles: {
      data: [],
      total: 0,
    },
    SelectedUserRole: null,
  },
})
@Injectable()
export class ConfigurationsState {
  constructor(private configurationsService: COnfigurationsService) {}

  @Selector()
  static isLoading(state: ConfigurationsStateModel) {
    return state.loading;
  }

  @Selector()
  static selectedCurrency(state: ConfigurationsStateModel) {
    return state.selectedCurrency;
  }

  @Selector()
  static selectedThriftTier(state: ConfigurationsStateModel) {
    return state.SelectedThriftTier;
  }

  @Selector()
  static selectedThriftCategory(state: ConfigurationsStateModel) {
    return state.SelectedThriftCategory;
  }

  @Selector()
  static selectedSubscriptionFee(state: ConfigurationsStateModel) {
    return state.SelectedSubscriptionFee;
  }

  @Selector()
  static selectedShareAmount(state: ConfigurationsStateModel) {
    return state.SelectedShareAmount;
  }

  @Selector()
  static selectedInvestmentType(state: ConfigurationsStateModel) {
    return state.SelectedInvestmentType;
  }

  @Selector()
  static selectedVendor(state: ConfigurationsStateModel) {
    return state.SelectedVendor;
  }

  @Selector()
  static selectedProductPlan(state: ConfigurationsStateModel) {
    return state.SelectedProductPlan;
  }

  @Selector()
  static selectedProduct(state: ConfigurationsStateModel) {
    return state.SelectedProduct;
  }

  @Selector()
  static selectedLoanType(state: ConfigurationsStateModel) {
    return state.SelectedLoanType;
  }

  @Selector()
  static selectedShareType(state: ConfigurationsStateModel) {
    return state.SelectedShareType;
  }

  @Selector()
  static selectedSavingsType(state: ConfigurationsStateModel) {
    return state.SelectedSavingsType;
  }

  @Selector()
  static selectedUserRole(state: ConfigurationsStateModel) {
    return state.SelectedUserRole;
  }

  @Selector()
  static currencies(state: ConfigurationsStateModel) {
    return state.currency;
  }

  @Selector()
  static thrift_categories(state: ConfigurationsStateModel) {
    return state.thrift_categories;
  }

  @Selector()
  static thrift_tiers(state: ConfigurationsStateModel) {
    return state.thrift_tiers;
  }

  @Selector()
  static subscriptions(state: ConfigurationsStateModel) {
    return state.subscription_fee;
  }

  @Selector()
  static shares_amount(state: ConfigurationsStateModel) {
    return state.shares_amount;
  }

  @Selector()
  static investment_types(state: ConfigurationsStateModel) {
    return state.investment_types;
  }

  @Selector()
  static vendors(state: ConfigurationsStateModel) {
    return state.vendors;
  }

  @Selector()
  static product_plans(state: ConfigurationsStateModel) {
    return state.product_plans;
  }

  @Selector()
  static products(state: ConfigurationsStateModel) {
    return state.products;
  }

  @Selector()
  static loan_types(state: ConfigurationsStateModel) {
    return state.loan_types;
  }

  @Selector()
  static share_types(state: ConfigurationsStateModel) {
    return state.share_types;
  }

  @Selector()
  static savings_types(state: ConfigurationsStateModel) {
    return state.savings_types;
  }

  @Selector()
  static user_roles(state: ConfigurationsStateModel) {
    return state.user_roles;
  }

  @Action(SetLoadingState)
  setLoading(
    ctx: StateContext<ConfigurationsStateModel>,
    { isLoading }: SetLoadingState
  ) {
    ctx.patchState({ loading: isLoading });
  }

  //Currencies

  @Action(GetCurrencies)
  getCurrencies(
    ctx: StateContext<ConfigurationsStateModel>,
    { payload }: GetCurrencies
  ) {
    const state = ctx.getState();
    ctx.patchState({ loading: true });

    return this.configurationsService.getCurrencies(payload).pipe(
      tap((result: any) => {
        ctx.patchState({
          currency: {
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
        console.error("Error fetching currencies:", err);
        return throwError(() => err);
      })
    );
  }

  @Action(EditCurrency)
  editCurrency(
    ctx: StateContext<ConfigurationsStateModel>,
    { id }: EditCurrency
  ) {
    const state = ctx.getState();
    ctx.patchState({ loading: true });

    return this.configurationsService.getCurrencies({}).pipe(
      tap((results: any) => {
        const currency = results.data.find((curr: any) => curr.id == id);
        ctx.patchState({
          selectedCurrency: currency || null,
        });
      }),
      finalize(() => ctx.patchState({ loading: false }))
    );
  }

  @Action(UpdateCurrency)
  updateCurrency(
    ctx: StateContext<ConfigurationsStateModel>,
    { payload, id }: UpdateCurrency
  ) {
    ctx.patchState({ loading: true });
    return this.configurationsService.updateCurrency(payload, id).pipe(
      tap({
        next: (res: any) => {
          const state = ctx.getState();
          const updatedCurrency = res.data;
          const updatedCurrencies = state.currency.data.map((currency: any) =>
            currency.id === id ? updatedCurrency : currency
          );
          const selectedCurrency =
            state.selectedCurrency?.id === id
              ? updatedCurrency
              : state.selectedCurrency;

          ctx.patchState({
            currency: {
              data: updatedCurrencies,
              total: state.currency.total,
            },
            selectedCurrency,
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

  //SUbscripton Fees

  @Action(GetSubscriptionFees)
  getSubscriptionFee(
    ctx: StateContext<ConfigurationsStateModel>,
    { payload }: GetSubscriptionFees
  ) {
    const state = ctx.getState();
    ctx.patchState({ loading: true });

    return this.configurationsService.getSubscriptionFees(payload).pipe(
      tap((result: any) => {
        ctx.patchState({
          subscription_fee: {
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
        console.error("Error fetching subscriptions:", err);
        return throwError(() => err);
      })
    );
  }

  @Action(EditSubscriptionFee)
  editSubscriptionFee(
    ctx: StateContext<ConfigurationsStateModel>,
    { id }: EditSubscriptionFee
  ) {
    const state = ctx.getState();
    ctx.patchState({ loading: true });

    return this.configurationsService.getSubscriptionFees({}).pipe(
      tap((results: any) => {
        const subscription = results.data.find((sub: any) => sub.id == id);
        ctx.patchState({
          SelectedSubscriptionFee: subscription || null,
        });
      }),
      finalize(() => ctx.patchState({ loading: false }))
    );
  }

  @Action(UpdateSubscriptionFee)
  updateSubscriptionFee(
    ctx: StateContext<ConfigurationsStateModel>,
    { payload, id }: UpdateSubscriptionFee
  ) {
    ctx.patchState({ loading: true });
    return this.configurationsService.updateSubscriptionFee(payload, id).pipe(
      tap({
        next: (res: any) => {
          const state = ctx.getState();
          const updatedSubscription = res.data;
          const updatedSubscriptions = state.subscription_fee.data.map(
            (subscription: any) =>
              subscription.id === id ? updatedSubscription : subscription
          );
          const selectedSubscriptionFee =
            state.SelectedSubscriptionFee?.id === id
              ? updatedSubscription
              : state.SelectedSubscriptionFee;

          ctx.patchState({
            currency: {
              data: updatedSubscriptions,
              total: state.currency.total,
            },
            SelectedSubscriptionFee: selectedSubscriptionFee,
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

  //Shares Amount
  @Action(GetSharesAmount)
  getSharesAmount(
    ctx: StateContext<ConfigurationsStateModel>,
    { payload }: GetSharesAmount
  ) {
    const state = ctx.getState();
    ctx.patchState({ loading: true });

    return this.configurationsService.getSharesAmount(payload).pipe(
      tap((result: any) => {
        ctx.patchState({
          shares_amount: {
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
        console.error("Error fetching shares amount:", err);
        return throwError(() => err);
      })
    );
  }

  @Action(EditShareAmount)
  editShareAmount(
    ctx: StateContext<ConfigurationsStateModel>,
    { id }: EditShareAmount
  ) {
    const state = ctx.getState();
    ctx.patchState({ loading: true });

    return this.configurationsService.getSharesAmount({}).pipe(
      tap((results: any) => {
        const share_amount = results.data.find((sa: any) => sa.id == id);
        ctx.patchState({
          SelectedShareAmount: share_amount || null,
        });
      }),
      finalize(() => ctx.patchState({ loading: false }))
    );
  }

  @Action(UpdateShareAmount)
  updateShareAmount(
    ctx: StateContext<ConfigurationsStateModel>,
    { payload, id }: UpdateShareAmount
  ) {
    ctx.patchState({ loading: true });
    return this.configurationsService.updateShareAmount(payload, id).pipe(
      tap({
        next: (res: any) => {
          const state = ctx.getState();
          const updatedShareAmount = res.data;
          const updatedShareAmounts = state.shares_amount.data.map((sa: any) =>
            sa.id === id ? updatedShareAmount : sa
          );
          const selectedShareAmounts =
            state.SelectedShareAmount?.id === id
              ? updatedShareAmount
              : state.SelectedShareAmount;

          ctx.patchState({
            shares_amount: {
              data: updatedShareAmounts,
              total: state.shares_amount.total,
            },
            SelectedShareAmount: selectedShareAmounts,
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

  //Thrift Categories
  @Action(GetThriftCategories)
  getThriftCategories(
    ctx: StateContext<ConfigurationsStateModel>,
    { payload }: GetThriftCategories
  ) {
    const state = ctx.getState();
    ctx.patchState({ loading: true });

    return this.configurationsService.getThriftCategories(payload).pipe(
      tap((result: any) => {
        ctx.patchState({
          thrift_categories: {
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
        console.error("Error fetching thrift categories:", err);
        return throwError(() => err);
      })
    );
  }

  @Action(EditThriftCategory)
  editThriftCategory(
    ctx: StateContext<ConfigurationsStateModel>,
    { id }: EditThriftCategory
  ) {
    const state = ctx.getState();
    ctx.patchState({ loading: true });

    return this.configurationsService.getThriftCategories({}).pipe(
      tap((results: any) => {
        const thrift_tiers = results.data.find((tt: any) => tt.id == id);
        ctx.patchState({
          SelectedThriftCategory: thrift_tiers || null,
        });
      }),
      finalize(() => ctx.patchState({ loading: false }))
    );
  }

  @Action(CreateThriftCategory)
  createThriftCategory(
    ctx: StateContext<ConfigurationsStateModel>,
    { payload }: CreateThriftCategory
  ) {
    const state = ctx.getState();
    ctx.patchState({ loading: true });

    return this.configurationsService.addThriftCategory(payload).pipe(
      tap((res: any) => {
        const state = ctx.getState();
        ctx.patchState({
          thrift_categories: {
            data: [...state.thrift_categories.data, res.data],
            total: state.thrift_categories.total + 1,
          },
          response: res,
        });
      }),
      finalize(() => ctx.patchState({ loading: false })),
      map((res: any) => res) // ✅ this returns the real API response to your component
    );
  }

  @Action(UpdateThriftCategory)
  updateThriftCategory(
    ctx: StateContext<ConfigurationsStateModel>,
    { payload, id }: UpdateThriftCategory
  ) {
    ctx.patchState({ loading: true });
    return this.configurationsService.updateThriftCategory(payload, id).pipe(
      tap({
        next: (res: any) => {
          const state = ctx.getState();
          const updatedCategory = res.data;
          const updatedCategories = state.thrift_categories.data.map(
            (cat: any) => (cat.id === id ? updatedCategory : cat)
          );
          const selectedCategory =
            state.SelectedThriftCategory?.id === id
              ? updatedCategory
              : state.SelectedThriftCategory;

          ctx.patchState({
            thrift_categories: {
              data: updatedCategories,
              total: state.thrift_categories.total,
            },
            SelectedThriftCategory: selectedCategory,
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

  @Action(DeleteThriftCategory)
  deleteThriftCategory(
    ctx: StateContext<ConfigurationsStateModel>,
    { id }: DeleteThriftCategory
  ) {
    ctx.patchState({ loading: true });
    return this.configurationsService.deleteThriftCategory(id).pipe(
      tap((res) => {
        const state = ctx.getState();
        const filteredThriftCategory = state.thrift_categories.data.filter(
          (tc) => tc.id !== id
        );
        ctx.patchState({
          thrift_categories: {
            data: filteredThriftCategory,
            total: state.thrift_categories.total - 1,
          },
          loading: false,
          response: res,
        });
      }),
      catchError((err) => {
        ctx.patchState({ loading: false });
        console.error("Error deleting Thrift Category:", err);
        return throwError(() => err);
      })
    );
  }

  //Thrift Tiers
  @Action(GetThriftTiers)
  getThriftTiers(
    ctx: StateContext<ConfigurationsStateModel>,
    { payload }: GetThriftTiers
  ) {
    const state = ctx.getState();
    ctx.patchState({ loading: true });

    return this.configurationsService.getThriftTiers(payload).pipe(
      tap((result: any) => {
        ctx.patchState({
          thrift_tiers: {
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
        console.error("Error fetching thrift tiers:", err);
        return throwError(() => err);
      })
    );
  }

  @Action(EditThriftTier)
  editThriftTier(
    ctx: StateContext<ConfigurationsStateModel>,
    { id }: EditThriftTier
  ) {
    const state = ctx.getState();
    ctx.patchState({ loading: true });

    return this.configurationsService.getThriftTiers({}).pipe(
      tap((results: any) => {
        const thrift_tiers = results.data.find((tt: any) => tt.id == id);
        ctx.patchState({
          SelectedThriftTier: thrift_tiers || null,
        });
      }),
      finalize(() => ctx.patchState({ loading: false }))
    );
  }

  @Action(CreateThriftTier)
  createThriftTier(
    ctx: StateContext<ConfigurationsStateModel>,
    { payload }: CreateThriftTier
  ) {
    const state = ctx.getState();
    ctx.patchState({ loading: true });

    return this.configurationsService.addThriftTier(payload).pipe(
      tap((res: any) => {
        const state = ctx.getState();
        ctx.patchState({
          thrift_tiers: {
            data: [...state.thrift_tiers.data, res.data],
            total: state.thrift_tiers.total + 1,
          },
          response: res,
        });
      }),
      finalize(() => ctx.patchState({ loading: false })),
      map((res: any) => res) // ✅ this returns the real API response to your component
    );
  }

  @Action(UpdateThriftTier)
  updateThriftTier(
    ctx: StateContext<ConfigurationsStateModel>,
    { payload, id }: UpdateThriftTier
  ) {
    ctx.patchState({ loading: true });
    return this.configurationsService.updateThriftTier(payload, id).pipe(
      tap({
        next: (res: any) => {
          const state = ctx.getState();
          const updatedTier = res.data;
          const updatedTiers = state.thrift_tiers.data.map((tt: any) =>
            tt.id === id ? updatedTier : tt
          );
          const selectedTier =
            state.SelectedThriftTier?.id === id
              ? updatedTier
              : state.SelectedThriftTier;

          ctx.patchState({
            thrift_tiers: {
              data: updatedTiers,
              total: state.thrift_tiers.total,
            },
            SelectedThriftTier: selectedTier,
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

  @Action(DeleteThriftTier)
  deleteThriftTier(
    ctx: StateContext<ConfigurationsStateModel>,
    { id }: DeleteThriftTier
  ) {
    ctx.patchState({ loading: true });
    return this.configurationsService.deleteThriftTier(id).pipe(
      tap((res) => {
        const state = ctx.getState();
        const filteredThriftTier = state.thrift_tiers.data.filter(
          (tt) => tt.id !== id
        );
        ctx.patchState({
          thrift_tiers: {
            data: filteredThriftTier,
            total: state.thrift_tiers.total - 1,
          },
          loading: false,
          response: res,
        });
      }),
      catchError((err) => {
        ctx.patchState({ loading: false });
        console.error("Error deleting Thrift Category:", err);
        return throwError(() => err);
      })
    );
  }

  //Investment Types
  @Action(GetInvestmentTypes)
  getInvestmentTypes(
    ctx: StateContext<ConfigurationsStateModel>,
    { payload }: GetInvestmentTypes
  ) {
    const state = ctx.getState();
    ctx.patchState({ loading: true });

    return this.configurationsService.getInvestmentTypes(payload).pipe(
      tap((result: any) => {
        ctx.patchState({
          investment_types: {
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
        console.error("Error fetching investment types:", err);
        return throwError(() => err);
      })
    );
  }

  @Action(EditInvestmentType)
  editInvestmentType(
    ctx: StateContext<ConfigurationsStateModel>,
    { id }: EditInvestmentType
  ) {
    const state = ctx.getState();
    ctx.patchState({ loading: true });

    return this.configurationsService.getInvestmentTypes({}).pipe(
      tap((results: any) => {
        const investment_types = results.data.find((tt: any) => tt.id == id);
        ctx.patchState({
          SelectedInvestmentType: investment_types || null,
        });
      }),
      finalize(() => ctx.patchState({ loading: false }))
    );
  }

  @Action(CreateInvestmentType)
  createInvestmentType(
    ctx: StateContext<ConfigurationsStateModel>,
    { payload }: CreateInvestmentType
  ) {
    const state = ctx.getState();
    ctx.patchState({ loading: true });

    return this.configurationsService.addInvestmentType(payload).pipe(
      tap((res: any) => {
        const state = ctx.getState();
        ctx.patchState({
          investment_types: {
            data: [...state.investment_types.data, res.data],
            total: state.investment_types.total + 1,
          },
          response: res,
        });
      }),
      finalize(() => ctx.patchState({ loading: false })),
      map((res: any) => res) // ✅ this returns the real API response to your component
    );
  }

  @Action(UpdateInvestmentType)
  updateInvestmentType(
    ctx: StateContext<ConfigurationsStateModel>,
    { payload, id }: UpdateInvestmentType
  ) {
    ctx.patchState({ loading: true });
    return this.configurationsService.updateInvestmentType(payload, id).pipe(
      tap({
        next: (res: any) => {
          const state = ctx.getState();
          const updatedInvestmentType = res.data;
          const updatedInvestmentTypes = state.investment_types.data.map(
            (it: any) => (it.id === id ? updatedInvestmentType : it)
          );
          const selectedInvestmentType =
            state.SelectedInvestmentType?.id === id
              ? updatedInvestmentType
              : state.SelectedInvestmentType;

          ctx.patchState({
            investment_types: {
              data: updatedInvestmentTypes,
              total: state.investment_types.total,
            },
            SelectedThriftTier: selectedInvestmentType,
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

  @Action(DeleteInvestmentType)
  deleteInvestmentType(
    ctx: StateContext<ConfigurationsStateModel>,
    { id }: DeleteInvestmentType
  ) {
    ctx.patchState({ loading: true });
    return this.configurationsService.deleteInvestmentType(id).pipe(
      tap((res) => {
        const state = ctx.getState();
        const filteredInvestmentType = state.investment_types.data.filter(
          (it) => it.id !== id
        );
        ctx.patchState({
          investment_types: {
            data: filteredInvestmentType,
            total: state.investment_types.total - 1,
          },
          loading: false,
          response: res,
        });
      }),
      catchError((err) => {
        ctx.patchState({ loading: false });
        console.error("Error deleting Investment Type:", err);
        return throwError(() => err);
      })
    );
  }

  //Vendors
  @Action(GetVendors)
  getVendors(
    ctx: StateContext<ConfigurationsStateModel>,
    { payload }: GetVendors
  ) {
    const state = ctx.getState();
    ctx.patchState({ loading: true });

    return this.configurationsService.getVendors(payload).pipe(
      tap((result: any) => {
        ctx.patchState({
          vendors: {
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
        console.error("Error fetching vendors:", err);
        return throwError(() => err);
      })
    );
  }

  @Action(EditVendor)
  editVendor(ctx: StateContext<ConfigurationsStateModel>, { id }: EditVendor) {
    const state = ctx.getState();
    ctx.patchState({ loading: true });

    return this.configurationsService.getVendors({}).pipe(
      tap((results: any) => {
        const vendors = results.data.find((vendor: any) => vendor.id == id);
        ctx.patchState({
          SelectedVendor: vendors || null,
        });
      }),
      finalize(() => ctx.patchState({ loading: false }))
    );
  }

  @Action(CreateVendor)
  createVendor(
    ctx: StateContext<ConfigurationsStateModel>,
    { payload }: CreateVendor
  ) {
    const state = ctx.getState();
    ctx.patchState({ loading: true });

    return this.configurationsService.addVendor(payload).pipe(
      tap((res: any) => {
        const state = ctx.getState();
        ctx.patchState({
          vendors: {
            data: [...state.vendors.data, res.data],
            total: state.vendors.total + 1,
          },
          response: res,
        });
      }),
      finalize(() => ctx.patchState({ loading: false })),
      map((res: any) => res) // ✅ this returns the real API response to your component
    );
  }

  @Action(UpdateVendor)
  updateVendor(
    ctx: StateContext<ConfigurationsStateModel>,
    { payload, id }: UpdateVendor
  ) {
    ctx.patchState({ loading: true });
    return this.configurationsService.updateVendor(payload, id).pipe(
      tap({
        next: (res: any) => {
          const state = ctx.getState();
          const updatedVendor = res.data;
          const updatedVendors = state.vendors.data.map((vendor: any) =>
            vendor.id === id ? updatedVendor : vendor
          );
          const SelectedVendor =
            state.SelectedVendor?.id === id
              ? updatedVendor
              : state.SelectedVendor;

          ctx.patchState({
            vendors: {
              data: updatedVendors,
              total: state.vendors.total,
            },
            SelectedVendor,
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

  @Action(DeleteVendor)
  deleteVendor(
    ctx: StateContext<ConfigurationsStateModel>,
    { id }: DeleteVendor
  ) {
    ctx.patchState({ loading: true });
    return this.configurationsService.deleteVendor(id).pipe(
      tap((res) => {
        const state = ctx.getState();
        const filteredVendors = state.vendors.data.filter(
          (vendor) => vendor.id !== id
        );
        ctx.patchState({
          vendors: {
            data: filteredVendors,
            total: state.vendors.total - 1,
          },
          loading: false,
          response: res,
        });
      }),
      catchError((err) => {
        ctx.patchState({ loading: false });
        console.error("Error deleting Vendor:", err);
        return throwError(() => err);
      })
    );
  }

  //Product Plans
  @Action(GetProductPlans)
  getProductPlans(
    ctx: StateContext<ConfigurationsStateModel>,
    { payload }: GetProductPlans
  ) {
    const state = ctx.getState();
    ctx.patchState({ loading: true });

    return this.configurationsService.getProductPlans(payload).pipe(
      tap((result: any) => {
        ctx.patchState({
          product_plans: {
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
        console.error("Error fetching product plans:", err);
        return throwError(() => err);
      })
    );
  }

  @Action(EditProductPlan)
  editProductPlan(
    ctx: StateContext<ConfigurationsStateModel>,
    { id }: EditProductPlan
  ) {
    const state = ctx.getState();
    ctx.patchState({ loading: true });

    return this.configurationsService.getProductPlans({}).pipe(
      tap((results: any) => {
        const product_plans = results.data.find(
          (prod_plan: any) => prod_plan.id == id
        );
        ctx.patchState({
          SelectedProductPlan: product_plans || null,
        });
      }),
      finalize(() => ctx.patchState({ loading: false }))
    );
  }

  @Action(CreateProductPlan)
  createProductPlan(
    ctx: StateContext<ConfigurationsStateModel>,
    { payload }: CreateProductPlan
  ) {
    const state = ctx.getState();
    ctx.patchState({ loading: true });

    return this.configurationsService.addProductPlan(payload).pipe(
      tap((res: any) => {
        const state = ctx.getState();
        ctx.patchState({
          product_plans: {
            data: [...state.product_plans.data, res.data],
            total: state.product_plans.total + 1,
          },
          response: res,
        });
      }),
      finalize(() => ctx.patchState({ loading: false })),
      map((res: any) => res) // ✅ this returns the real API response to your component
    );
  }

  @Action(UpdateProductPlan)
  updateProductPlan(
    ctx: StateContext<ConfigurationsStateModel>,
    { payload, id }: UpdateProductPlan
  ) {
    ctx.patchState({ loading: true });
    return this.configurationsService.updateProductPlan(payload, id).pipe(
      tap({
        next: (res: any) => {
          const state = ctx.getState();
          const updatedProductPlan = res.data;
          const updatedProductPlans = state.product_plans.data.map(
            (prod_plan: any) =>
              prod_plan.id === id ? updatedProductPlan : prod_plan
          );
          const SelectedProductPlan =
            state.SelectedProductPlan?.id === id
              ? updatedProductPlan
              : state.SelectedProductPlan;

          ctx.patchState({
            product_plans: {
              data: updatedProductPlans,
              total: state.product_plans.total,
            },
            SelectedProductPlan,
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

  @Action(DeleteProductPlan)
  deleteProductPlan(
    ctx: StateContext<ConfigurationsStateModel>,
    { id }: DeleteProductPlan
  ) {
    ctx.patchState({ loading: true });
    return this.configurationsService.deleteProductPlan(id).pipe(
      tap((res) => {
        const state = ctx.getState();
        const filteredProductPlans = state.product_plans.data.filter(
          (prod_plan) => prod_plan.id !== id
        );
        ctx.patchState({
          product_plans: {
            data: filteredProductPlans,
            total: state.product_plans.total - 1,
          },
          loading: false,
          response: res,
        });
      }),
      catchError((err) => {
        ctx.patchState({ loading: false });
        console.error("Error deleting Product Plan:", err);
        return throwError(() => err);
      })
    );
  }

  //Products
  @Action(GetProducts)
  getProducts(
    ctx: StateContext<ConfigurationsStateModel>,
    { payload }: GetProducts
  ) {
    const state = ctx.getState();
    ctx.patchState({ loading: true });

    return this.configurationsService.getProducts(payload).pipe(
      tap((result: any) => {
        ctx.patchState({
          products: {
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
        console.error("Error fetching product plans:", err);
        return throwError(() => err);
      })
    );
  }

  @Action(EditProduct)
  editProduct(
    ctx: StateContext<ConfigurationsStateModel>,
    { id }: EditProduct
  ) {
    const state = ctx.getState();
    ctx.patchState({ loading: true });

    return this.configurationsService.getProducts({}).pipe(
      tap((results: any) => {
        const products = results.data.find((prod: any) => prod.id == id);
        ctx.patchState({
          SelectedProduct: products || null,
        });
      }),
      finalize(() => ctx.patchState({ loading: false }))
    );
  }

  @Action(CreateProduct)
  createProduct(
    ctx: StateContext<ConfigurationsStateModel>,
    { payload }: CreateProduct
  ) {
    const state = ctx.getState();
    ctx.patchState({ loading: true });

    return this.configurationsService.addProduct(payload).pipe(
      tap((res: any) => {
        const state = ctx.getState();
        ctx.patchState({
          products: {
            data: [...state.products.data, res.data],
            total: state.products.total + 1,
          },
          response: res,
        });
      }),
      finalize(() => ctx.patchState({ loading: false })),
      map((res: any) => res) // ✅ this returns the real API response to your component
    );
  }

  @Action(UpdateProduct)
  updateProduct(
    ctx: StateContext<ConfigurationsStateModel>,
    { payload, id }: UpdateProduct
  ) {
    ctx.patchState({ loading: true });
    return this.configurationsService.updateProduct(payload, id).pipe(
      tap({
        next: (res: any) => {
          const state = ctx.getState();
          const updatedProduct = res.data;
          const updatedProducts = state.products.data.map((prod: any) =>
            prod.id === id ? updatedProduct : prod
          );
          const SelectedProduct =
            state.SelectedProduct?.id === id
              ? updatedProduct
              : state.SelectedProduct;

          ctx.patchState({
            products: {
              data: updatedProducts,
              total: state.products.total,
            },
            SelectedProduct,
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

  @Action(DeleteProduct)
  deleteProduct(
    ctx: StateContext<ConfigurationsStateModel>,
    { id }: DeleteProduct
  ) {
    ctx.patchState({ loading: true });
    return this.configurationsService.deleteProduct(id).pipe(
      tap((res) => {
        const state = ctx.getState();
        const filteredProducts = state.products.data.filter(
          (prod) => prod.id !== id
        );
        ctx.patchState({
          products: {
            data: filteredProducts,
            total: state.products.total - 1,
          },
          loading: false,
          response: res,
        });
      }),
      catchError((err) => {
        ctx.patchState({ loading: false });
        console.error("Error deleting Product:", err);
        return throwError(() => err);
      })
    );
  }

  // Loan Types
  @Action(GetLoanTypes)
  getLoanTypes(
    ctx: StateContext<ConfigurationsStateModel>,
    { payload }: GetLoanTypes
  ) {
    ctx.patchState({ loading: true });

    return this.configurationsService.getLoanTypes(payload).pipe(
      tap((result: any) => {
        ctx.patchState({
          loan_types: {
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
        console.error("Error fetching loan types:", err);
        return throwError(() => err);
      })
    );
  }

  @Action(EditLoanType)
  editLoanType(
    ctx: StateContext<ConfigurationsStateModel>,
    { id }: EditLoanType
  ) {
    ctx.patchState({ loading: true });

    return this.configurationsService.getLoanTypes({}).pipe(
      tap((results: any) => {
        const loanType = results.data.find((lt: any) => lt.id == id);
        ctx.patchState({
          SelectedLoanType: loanType || null,
        });
      }),
      finalize(() => ctx.patchState({ loading: false }))
    );
  }

  @Action(CreateLoanType)
  createLoanType(
    ctx: StateContext<ConfigurationsStateModel>,
    { payload }: CreateLoanType
  ) {
    ctx.patchState({ loading: true });

    return this.configurationsService.addLoanType(payload).pipe(
      tap((res: any) => {
        const state = ctx.getState();
        ctx.patchState({
          loan_types: {
            data: [...(state.loan_types?.data || []), res.data],
            total: (state.loan_types?.total || 0) + 1,
          },
          response: res,
        });
      }),
      finalize(() => ctx.patchState({ loading: false })),
      map((res: any) => res)
    );
  }

  @Action(UpdateLoanType)
  updateLoanType(
    ctx: StateContext<ConfigurationsStateModel>,
    { payload, id }: UpdateLoanType
  ) {
    ctx.patchState({ loading: true });
    return this.configurationsService.updateLoanType(payload, id).pipe(
      tap({
        next: (res: any) => {
          const state = ctx.getState();
          const updatedLoanType = res.data;
          const updatedLoanTypes = (state.loan_types?.data || []).map(
            (lt: any) => (lt.id === id ? updatedLoanType : lt)
          );
          const SelectedLoanType =
            state.SelectedLoanType?.id === id
              ? updatedLoanType
              : state.SelectedLoanType;

          ctx.patchState({
            loan_types: {
              data: updatedLoanTypes,
              total: state.loan_types?.total || 0,
            },
            SelectedLoanType,
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

  @Action(DeleteLoanType)
  deleteLoanType(
    ctx: StateContext<ConfigurationsStateModel>,
    { id }: DeleteLoanType
  ) {
    ctx.patchState({ loading: true });
    return this.configurationsService.deleteLoanType(id).pipe(
      tap((res) => {
        const state = ctx.getState();
        const filteredLoanTypes = (state.loan_types?.data || []).filter(
          (lt) => lt.id !== id
        );
        ctx.patchState({
          loan_types: {
            data: filteredLoanTypes,
            total: (state.loan_types?.total || 1) - 1,
          },
          loading: false,
          response: res,
        });
      }),
      catchError((err) => {
        ctx.patchState({ loading: false });
        console.error("Error deleting Loan Type:", err);
        return throwError(() => err);
      })
    );
  }

  // Shares Types
  @Action(GetSharesTypes)
  getSharesTypes(
    ctx: StateContext<ConfigurationsStateModel>,
    { payload }: GetSharesTypes
  ) {
    ctx.patchState({ loading: true });

    return this.configurationsService.getSharesTypes(payload).pipe(
      tap((result: any) => {
        ctx.patchState({
          share_types: {
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
        console.error("Error fetching shares types:", err);
        return throwError(() => err);
      })
    );
  }

  @Action(EditSharesType)
  editSharesType(
    ctx: StateContext<ConfigurationsStateModel>,
    { id }: EditSharesType
  ) {
    ctx.patchState({ loading: true });

    return this.configurationsService.getSharesTypes({}).pipe(
      tap((results: any) => {
        const shareType = results.data.find((st: any) => st.id == id);
        ctx.patchState({
          SelectedShareType: shareType || null,
        });
      }),
      finalize(() => ctx.patchState({ loading: false }))
    );
  }

  @Action(CreateSharesType)
  createSharesType(
    ctx: StateContext<ConfigurationsStateModel>,
    { payload }: CreateSharesType
  ) {
    ctx.patchState({ loading: true });

    return this.configurationsService.addSharesType(payload).pipe(
      tap((res: any) => {
        const state = ctx.getState();
        ctx.patchState({
          share_types: {
            data: [...(state.share_types?.data || []), res.data],
            total: (state.share_types?.total || 0) + 1,
          },
          response: res,
        });
      }),
      finalize(() => ctx.patchState({ loading: false })),
      map((res: any) => res)
    );
  }

  @Action(UpdateSharesType)
  updateSharesType(
    ctx: StateContext<ConfigurationsStateModel>,
    { payload, id }: UpdateSharesType
  ) {
    ctx.patchState({ loading: true });
    return this.configurationsService.updateSharesType(payload, id).pipe(
      tap({
        next: (res: any) => {
          const state = ctx.getState();
          const updatedShareType = res.data;
          const updatedShareTypes = (state.share_types?.data || []).map(
            (st: any) => (st.id === id ? updatedShareType : st)
          );
          const SelectedShareType =
            state.SelectedShareType?.id === id
              ? updatedShareType
              : state.SelectedShareType;

          ctx.patchState({
            share_types: {
              data: updatedShareTypes,
              total: state.share_types?.total || 0,
            },
            SelectedShareType,
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

  @Action(UpdateSharesTypeStatus)
  updateSharesTypeStatus(
    ctx: StateContext<ConfigurationsStateModel>,
    { id, payload }: UpdateSharesTypeStatus
  ) {
    ctx.patchState({ loading: true });
    return this.configurationsService
      .updateSharesTypeStatus({ status: payload }, id)
      .pipe(
        tap((res) => {
          const state = ctx.getState();
          const filteredShareTypes = (state.share_types?.data || []).filter(
            (st) => st.id !== id
          );
          ctx.patchState({
            share_types: {
              data: filteredShareTypes,
              total: (state.share_types?.total || 1) - 1,
            },
            loading: false,
            response: res,
          });
        }),
        catchError((err) => {
          ctx.patchState({ loading: false });
          console.error("Error deleting Share Type:", err);
          return throwError(() => err);
        })
      );
  }

  // Savings Types
  @Action(GetSavingsTypes)
  getSavingsTypes(
    ctx: StateContext<ConfigurationsStateModel>,
    { payload }: GetSavingsTypes
  ) {
    ctx.patchState({ loading: true });

    return this.configurationsService.getSavingsTypes(payload).pipe(
      tap((result: any) => {
        ctx.patchState({
          savings_types: {
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
        console.error("Error fetching savings types:", err);
        return throwError(() => err);
      })
    );
  }

  @Action(EditSavingsType)
  editSavingsType(
    ctx: StateContext<ConfigurationsStateModel>,
    { id }: EditSavingsType
  ) {
    ctx.patchState({ loading: true });

    return this.configurationsService.getSavingsTypes({}).pipe(
      tap((results: any) => {
        const savingsType = results.data.find((st: any) => st.id == id);
        ctx.patchState({
          SelectedSavingsType: savingsType || null,
        });
      }),
      finalize(() => ctx.patchState({ loading: false }))
    );
  }

  @Action(CreateSavingsType)
  createSavingsType(
    ctx: StateContext<ConfigurationsStateModel>,
    { payload }: CreateSavingsType
  ) {
    ctx.patchState({ loading: true });

    return this.configurationsService.addSavingsType(payload).pipe(
      tap((res: any) => {
        const state = ctx.getState();
        ctx.patchState({
          savings_types: {
            data: [...(state.savings_types?.data || []), res.data],
            total: (state.savings_types?.total || 0) + 1,
          },
          response: res,
        });
      }),
      finalize(() => ctx.patchState({ loading: false })),
      map((res: any) => res)
    );
  }

  @Action(UpdateSavingsType)
  updateSavingsType(
    ctx: StateContext<ConfigurationsStateModel>,
    { payload, id }: UpdateSavingsType
  ) {
    ctx.patchState({ loading: true });
    return this.configurationsService.updateSavingsType(payload, id).pipe(
      tap({
        next: (res: any) => {
          const state = ctx.getState();
          const updatedSavingsType = res.data;
          const updatedSavingsTypes = (state.savings_types?.data || []).map(
            (st: any) => (st.id === id ? updatedSavingsType : st)
          );
          const SelectedSavingsType =
            state.SelectedSavingsType?.id === id
              ? updatedSavingsType
              : state.SelectedSavingsType;

          ctx.patchState({
            savings_types: {
              data: updatedSavingsTypes,
              total: state.savings_types?.total || 0,
            },
            SelectedSavingsType,
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

  @Action(UpdateSavingsTypeStatus)
  updateSavingsTypeStatus(
    ctx: StateContext<ConfigurationsStateModel>,
    { id, payload }: UpdateSavingsTypeStatus
  ) {
    ctx.patchState({ loading: true });
    return this.configurationsService
      .updateSavingsTypeStatus({ status: payload }, id)
      .pipe(
        tap((res) => {
          const state = ctx.getState();
          const updatedSavingsTypes = (state.savings_types?.data || []).map(
            (st) => (st.id === id ? { ...st, is_activated: payload } : st)
          );
          ctx.patchState({
            savings_types: {
              data: updatedSavingsTypes,
              total: state.savings_types?.total || 0,
            },
            loading: false,
            response: res,
          });
        }),
        catchError((err) => {
          ctx.patchState({ loading: false });
          console.error("Error updating Savings Type status:", err);
          return throwError(() => err);
        })
      );
  }

  // User Roles
  @Action(GetUserRoles)
  getUserRoles(
    ctx: StateContext<ConfigurationsStateModel>,
    { payload }: GetUserRoles
  ) {
    ctx.patchState({ loading: true });

    return this.configurationsService.getUserRoles(payload).pipe(
      tap((result: any) => {
        ctx.patchState({
          user_roles: {
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
        console.error("Error fetching user roles:", err);
        return throwError(() => err);
      })
    );
  }

  @Action(EditUserRole)
  editUserRole(
    ctx: StateContext<ConfigurationsStateModel>,
    { id }: EditUserRole
  ) {
    ctx.patchState({ loading: true });

    return this.configurationsService.getUserRoles({}).pipe(
      tap((results: any) => {
        const userRole = results.data.find((ur: any) => ur.id == id);
        ctx.patchState({
          SelectedUserRole: userRole || null,
        });
      }),
      finalize(() => ctx.patchState({ loading: false }))
    );
  }

  @Action(CreateUserRole)
  createUserRole(
    ctx: StateContext<ConfigurationsStateModel>,
    { payload }: CreateUserRole
  ) {
    ctx.patchState({ loading: true });

    return this.configurationsService.addUserRole(payload).pipe(
      tap((res: any) => {
        const state = ctx.getState();
        ctx.patchState({
          user_roles: {
            data: [...(state.user_roles?.data || []), res.data],
            total: (state.user_roles?.total || 0) + 1,
          },
          response: res,
        });
      }),
      finalize(() => ctx.patchState({ loading: false })),
      map((res: any) => res)
    );
  }

  @Action(UpdateUserRole)
  updateUserRole(
    ctx: StateContext<ConfigurationsStateModel>,
    { payload, id }: UpdateUserRole
  ) {
    ctx.patchState({ loading: true });
    return this.configurationsService.updateUserRole(payload, id).pipe(
      tap({
        next: (res: any) => {
          const state = ctx.getState();
          const updatedUserRole = res.data;
          const updatedUserRoles = (state.user_roles?.data || []).map(
            (ur: any) => (ur.id === id ? updatedUserRole : ur)
          );
          const selectedUserRole =
            state.SelectedUserRole?.id === id
              ? updatedUserRole
              : state.SelectedUserRole;

          ctx.patchState({
            user_roles: {
              data: updatedUserRoles,
              total: state.user_roles?.total || 0,
            },
            SelectedUserRole: selectedUserRole,
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

  @Action(DeleteUserRole)
  deleteUserRole(
    ctx: StateContext<ConfigurationsStateModel>,
    { id }: DeleteUserRole
  ) {
    ctx.patchState({ loading: true });
    return this.configurationsService.deleteUserRole(id).pipe(
      tap((res) => {
        const state = ctx.getState();
        const filteredUserRoles = (state.user_roles?.data || []).filter(
          (ur) => ur.id !== id
        );
        ctx.patchState({
          user_roles: {
            data: filteredUserRoles,
            total: (state.user_roles?.total || 1) - 1,
          },
          loading: false,
          response: res,
        });
      }),
      catchError((err) => {
        ctx.patchState({ loading: false });
        console.error("Error deleting User Role:", err);
        return throwError(() => err);
      })
    );
  }
}
