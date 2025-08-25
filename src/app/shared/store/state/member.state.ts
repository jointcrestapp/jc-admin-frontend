import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { catchError, finalize, map, tap, throwError } from "rxjs";
import {
  GetMembers,
  CreateMember,
  EditMember,
  UpdateMember,
  UpdateMemberStatus,
  DeleteMember,
  DeleteAllMember,
  CreateMemberAddress,
  ImportMember,
  ExportMember,
  SetLoadingState,
  GetBanks,
  GetBankCode,
  GetBankKYC,
  GetPendingMembers,
  GetExitedMembers,
  GetAccountRequestClosure,
  UpdateDeleteStatus,
  ReactivateMember,
  GetAgents,
} from "../action/member.action";
import { MemberService } from "../../../core/services/member.service";
import { NotificationService } from "../../services/notification.service";
import { ExcelService } from "../../../core/services/excel.service";

export interface MemberStateModel {
  member: {
    data: any[];
    total: any | null;
  };
  agents: {
    data: any[];
    total: any | null;
  };
  pending_members?: any[];
  exited_members?: any[];
  account_closure_request?: any[];
  loading?: boolean;
  selectedMember?: any | null;
  response?: any;
  statistics?: any | null;
  banks?: any | null;
  bank_code?: any | null;
  bank_name?: any | null;
  account_details?: any | null;
  logo?: any | null;
  total?: any | null;
}

@State<MemberStateModel>({
  name: "member",
  defaults: {
    member: {
      data: [],
      total: 0,
    },
    agents: {
      data: [],
      total: 0,
    },
    pending_members: [],
    exited_members: [],
    account_closure_request: [],
    loading: false,
    selectedMember: null,
    statistics: null,
    banks: null,
    bank_code: null,
    bank_name: null,
    account_details: null,
    logo: null,
    total: null,
  },
})
@Injectable()
export class MemberState {
  constructor(
    private memberService: MemberService,
    private notificationService: NotificationService,
    private excelService: ExcelService
  ) {}

  @Selector()
  static isLoading(state: MemberStateModel) {
    return state.loading;
  }

  @Selector()
  static member(state: MemberStateModel) {
    return state.member;
  }

  @Selector()
  static agents(state: MemberStateModel) {
    return state.agents;
  }

  @Selector()
  static pending_members(state: MemberStateModel) {
    return state.pending_members;
  }

  @Selector()
  static exited_member(state: MemberStateModel) {
    return state.exited_members;
  }

  @Selector()
  static account_closure_request(state: MemberStateModel) {
    return state.account_closure_request;
  }

  @Selector()
  static bank_code(state: MemberStateModel) {
    return state.bank_code;
  }

  @Selector()
  static logo(state: MemberStateModel) {
    return state.logo;
  }

  @Selector()
  static bank_name(state: MemberStateModel) {
    return state.bank_name;
  }

  @Selector()
  static account_details(state: MemberStateModel) {
    return state.account_details;
  }

  @Selector()
  static members(state: MemberStateModel) {
    return state.member.data.map((user) => {
      return { label: user?.first_name, value: user?.id };
    });
  }

  @Selector()
  static selectedMember(state: MemberStateModel) {
    return state.selectedMember;
  }

  @Selector()
  static statistics(state: MemberStateModel) {
    return state.statistics;
  }

  @Selector()
  static banks(state: MemberStateModel) {
    return state?.banks?.map((bank: any) => {
      return { label: bank?.name, value: bank?.name, logo: bank?.logo };
    });
  }

  @Action(SetLoadingState)
  setLoading(
    ctx: StateContext<MemberStateModel>,
    { isLoading }: SetLoadingState
  ) {
    ctx.patchState({ loading: isLoading });
  }

  @Action(GetMembers)
  getMembers(ctx: StateContext<MemberStateModel>, { payload }: GetMembers) {
    const state = ctx.getState();
    ctx.patchState({ loading: true });

    return this.memberService.getMembers(payload).pipe(
      tap((result: any) => {
        const members = (result?.data || []).map((element: any) => {
          element.role_name = element?.account_type == 3 ? "Member" : "Admin";
          element.name = element?.first_name + " " + element?.last_name;
          element.status = element?.is_activated == 1 ? 1 : 0;
          return element;
        });

        ctx.patchState({
          member: {
            data: members,
            total: result?.pagination?.total || result?.total || members.length,
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

  @Action(GetAgents)
  getAgents(ctx: StateContext<MemberStateModel>, { payload }: GetAgents) {
    const state = ctx.getState();
    ctx.patchState({ loading: true });

    return this.memberService.getAgents(payload).pipe(
      tap((result: any) => {
        const agents = (result?.data || []).map((element: any) => {
          element.role_name = element?.account_type == 4 ? "Agent" : "Admin";
          element.name = element?.first_name + " " + element?.last_name;
          element.status = element?.is_activated == 1 ? 1 : 0;
          return element;
        });

        ctx.patchState({
          agents: {
            data: agents,
            total: result?.pagination?.total || result?.total || agents.length,
          },
          statistics: result?.counts,
          loading: false,
        });
      }),
      catchError((err) => {
        ctx.patchState({ loading: false });
        console.error("Error fetching agents:::::", err);
        return throwError(() => err);
      })
    );
  }

  @Action(GetPendingMembers)
  getPendingMembers(
    ctx: StateContext<MemberStateModel>,
    { payload }: GetPendingMembers
  ) {
    const state = ctx.getState();
    ctx.patchState({ loading: true });

    return this.memberService.getPendingMembers(payload).pipe(
      tap((result: any) => {
        const members = (result?.data || []).map((element: any) => {
          element.role_name = element?.account_type == 3 ? "Member" : "Admin";
          element.name = element?.first_name + " " + element?.last_name;
          element.status = element?.is_activated == 1 ? 1 : 0;
          return element;
        });

        ctx.patchState({
          ...state,
          pending_members: members,
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

  @Action(GetAccountRequestClosure)
  getAccountRequestClosure(
    ctx: StateContext<MemberStateModel>,
    { payload }: GetAccountRequestClosure
  ) {
    const state = ctx.getState();
    ctx.patchState({ loading: true });

    return this.memberService.getAccountRequestClosure(payload).pipe(
      tap((result: any) => {
        const members = (result?.data || []).map((element: any) => {
          element.role_name = element?.account_type == 3 ? "Member" : "Admin";
          element.name = element?.first_name + " " + element?.last_name;
          element.status = element?.is_activated == 1 ? 1 : 0;
          return element;
        });

        ctx.patchState({
          ...state,
          account_closure_request: members,
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

  @Action(GetExitedMembers)
  getExitedMembers(
    ctx: StateContext<MemberStateModel>,
    { payload }: GetExitedMembers
  ) {
    const state = ctx.getState();
    ctx.patchState({ loading: true });

    return this.memberService.getExitedMembers(payload).pipe(
      tap((result: any) => {
        const members = (result?.data || []).map((element: any) => {
          element.role_name = element?.account_type == 3 ? "Member" : "Admin";
          element.name = element?.first_name + " " + element?.last_name;
          element.status = element?.is_activated == 1 ? 1 : 0;
          return element;
        });

        ctx.patchState({
          ...state,
          exited_members: members,
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

  @Action(GetBankKYC)
  getBankKYC(ctx: StateContext<MemberStateModel>, { payload }: GetBankKYC) {
    ctx.patchState({ loading: true });

    return this.memberService.getKYC(payload).pipe(
      tap((result: any) => {
        
        if (result.status === 200) {
          
          // ✅ valid result
          ctx.patchState({
            account_details: result,
            response: result,
            loading: false,
          });
        } else {
            // invalid result
          ctx.patchState({
            account_details: null,
            response: null,
            loading: false,
          });
          this.notificationService.showError(result?.message || "Account name not found. Please check the account details and try again.");
        }
      }),
      catchError((err) => {
        ctx.patchState({ loading: false });
        console.error("Error fetching users:", err);
        return throwError(() => err);
      })
    );
  }

  @Action(CreateMember)
  create(ctx: StateContext<MemberStateModel>, { payload }: CreateMember) {
    const state = ctx.getState();
    ctx.patchState({ loading: true });

    return this.memberService.addMember(payload).pipe(
      tap((res: any) => {
        const state = ctx.getState();
        ctx.patchState({
          ...state,
          member: {
            data: [...state.member.data, res.data],
            total: state.member.total + 1,
          },
          response: res,
        });
      }),
      finalize(() => ctx.patchState({ loading: false })),
      map((res: any) => res) // ✅ this returns the real API response to your component
    );
  }

  @Action(EditMember)
  editUser(ctx: StateContext<MemberStateModel>, { id }: EditMember) {
    const state = ctx.getState();
    ctx.patchState({ loading: true });

    return this.memberService.getMembers({}).pipe(
      tap((results: any) => {
        const member = results.data.find((u: any) => u.id == id);
        ctx.patchState({
          ...state,
          selectedMember: member || null,
        });
      }),
      finalize(() => ctx.patchState({ loading: false }))
    );
  }

  @Action(GetBanks)
  getBanks(ctx: StateContext<MemberStateModel>, action: GetBanks) {
    ctx.patchState({ loading: true });
    const state = ctx.getState();
    return this.memberService.getNigerianBanks().pipe(
      tap({
        next: (result) => {
          // console.log("Banks :::::", result);
          ctx.patchState({
            ...state,
            banks: result,
            loading: false,
          });
        },
        error: (err) => {
          console.log("Error >>>>>>>>>>>>>", err);
          ctx.patchState({ loading: false });
          throw new Error(err?.error?.message);
        },
      })
    );
  }

  @Action(GetBankCode)
  getBankCode(ctx: StateContext<MemberStateModel>, { id }: GetBankCode) {
    const state = ctx.getState();

    return this.memberService.getNigerianBanks().pipe(
      tap((results: any) => {
        // console.log("Nigeria Banks ::::::", results);
        ctx.patchState({
          account_details: null,
          response: null,
          loading: false,
        });
        const state = ctx.getState();
        const bank = results.find((bank: any) => bank?.name == id);
        ctx.patchState({
          ...state,
          logo: bank?.logo,
          bank_code: bank?.code,
        });
        
      })
    );
  }

  @Action(UpdateMember)
  update(ctx: StateContext<MemberStateModel>, { payload, id }: UpdateMember) {
    ctx.patchState({ loading: true });
    return this.memberService.updateMember(payload, id).pipe(
      tap({
        next: (res: any) => {
          const state = ctx.getState();
          const updatedUser = res.data;
          const updatedUsers = state.member.data.map((member) =>
            member.id === id ? updatedUser : member
          );
          const selectedMember =
            state.selectedMember?.id === id
              ? updatedUser
              : state.selectedMember;

          ctx.patchState({
            ...state,
            member: {
              data: updatedUsers,
              total: state.member.total,
            },
            selectedMember,
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

  @Action(ReactivateMember)
  reactivateMember(
    ctx: StateContext<MemberStateModel>,
    { id }: ReactivateMember
  ) {
    ctx.patchState({ loading: true });
    const payload = {
      is_deleted: 0,
    };
    return this.memberService.reactivateMember(payload, id).pipe(
      tap({
        next: (res: any) => {
          const state = ctx.getState();

          const remainingExistedMembers = state.exited_members.filter(
            (em) => em.id !== id
          );

          ctx.patchState({
            ...state,
            exited_members: remainingExistedMembers,
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

  @Action(UpdateDeleteStatus)
  updateDeleteStatus(
    ctx: StateContext<MemberStateModel>,
    { id, request_id }: UpdateDeleteStatus
  ) {
    ctx.patchState({ loading: true });
    let payload = {
      status: 1,
      request_id,
    };

    return this.memberService.updateDeleteStatus(payload, id).pipe(
      tap((res: any) => {
        const state = ctx.getState();
        const updateAccountClosureRequest =
          state.account_closure_request.filter((acr) => acr.id !== id);

        ctx.patchState({
          ...state,
          account_closure_request: updateAccountClosureRequest,
          loading: false,
          response: res,
        });
      }),
      map((res: any) => res),
      catchError((err) => {
        ctx.patchState({ loading: false });
        console.error("Error updating user status:", err);
        return throwError(() => err);
      })
    );
  }

  @Action(UpdateMemberStatus)
  updateStatus(
    ctx: StateContext<MemberStateModel>,
    { id, status }: UpdateMemberStatus
  ) {
    ctx.patchState({ loading: true });
    let payload = {
      status: status,
    };

    return this.memberService.updateMemberStatus(payload, id).pipe(
      tap((res: any) => {
        const state = ctx.getState();
        const updatedMembers = state.member.data.map((member) =>
          member.id === id ? { ...member, is_activated: status } : member
        );

        const updatePendingMembers = state.pending_members.filter(
          (pm) => pm.id !== id
        );
        console.log("Pending members :::::", updatePendingMembers);

        ctx.patchState({
          ...state,
          member: {
            data: updatedMembers,
            total: state.member.total,
          },
          pending_members: updatePendingMembers,
          loading: false,
          response: res,
        });
      }),
      map((res: any) => res),
      catchError((err) => {
        ctx.patchState({ loading: false });
        console.error("Error updating user status:", err);
        return throwError(() => err);
      })
    );
  }

  @Action(DeleteMember)
  deleteUser(ctx: StateContext<MemberStateModel>, { id }: DeleteMember) {
    ctx.patchState({ loading: true });
    return this.memberService.deleteMember(id).pipe(
      tap((res) => {
        const state = ctx.getState();
        const filteredMembers = state.member.data.filter(
          (member) => member.id !== id
        );
        ctx.patchState({
          ...state,
          member: {
            data: filteredMembers,
            total: state.member.total - 1,
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

  @Action(DeleteAllMember)
  deleteAllUsers(
    ctx: StateContext<MemberStateModel>,
    { ids }: DeleteAllMember
  ) {
    ctx.patchState({ loading: true });

    return this.memberService.deleteMultipleMembers(ids).pipe(
      tap(() => {
        const state = ctx.getState();
        const remainingMembers = state.member.data.filter(
          (member) => !ids.includes(member.id)
        );
        ctx.patchState({
          ...state,
          member: {
            data: remainingMembers,
            total: state.member.total - ids.length,
          },
          loading: false,
        });
      }),
      catchError((err) => {
        ctx.patchState({ loading: false });
        console.error("Error deleting multiple users:", err);
        return throwError(() => err);
      })
    );
  }

  @Action(ImportMember)
  import(ctx: StateContext<MemberStateModel>, action: ImportMember) {
    // Import User Logic Here
  }

  @Action(ExportMember)
  export(
    ctx: StateContext<MemberStateModel>,
    { memberType, customData }: ExportMember
  ) {
    const state = ctx.getState();
    ctx.patchState({ loading: true });

    let membersToExport: any[] = [];
    let exportType = memberType;

    if (customData && customData.length > 0) {
      membersToExport = customData;
      exportType = "custom_selection";
    } else {
      switch (memberType) {
        case "pending_members":
          membersToExport = state.pending_members || [];
          break;
        case "exited_members":
          membersToExport = state.exited_members || [];
          break;
        case "account_closure_request":
          membersToExport = state.account_closure_request || [];
          break;
        case "agents":
          membersToExport = state.agents.data || [];
          break;
        case "all_members":
        default:
          membersToExport = state.member.data || [];
          exportType = "all_members";
          break;
      }
    }

    if (!membersToExport || membersToExport.length === 0) {
      ctx.patchState({ loading: false });
      this.notificationService.showError(
        `No ${this.getMemberTypeDisplayName(
          exportType
        )} data available to export`
      );
      return;
    }

    return this.excelService
      .exportMembersToExcel(membersToExport, exportType)
      .pipe(
        tap(() => {
          ctx.patchState({ loading: false });
        }),
        catchError((err) => {
          ctx.patchState({ loading: false });
          console.error("Error exporting members:", err);
          return throwError(() => err);
        })
      );
  }

  private getMemberTypeDisplayName(memberType: string): string {
    const displayNames: { [key: string]: string } = {
      all_members: "all members",
      pending_members: "pending members",
      exited_members: "exited members",
      account_closure_request: "account closure requests",
      agents: "agents",
      custom_selection: "selected members",
    };
    return displayNames[memberType] || "members";
  }

  @Action(CreateMemberAddress)
  createUserAddress(
    ctx: StateContext<MemberStateModel>,
    action: CreateMemberAddress
  ) {
    // Create User Address Logic Here
  }
}
