import { Component, inject, ViewChild } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { PageWrapperComponent } from "../../../shared/components/page-wrapper/page-wrapper.component";
import { TableComponent } from "../../../shared/components/ui/table/table.component";
import { ImportCsvModalComponent } from "../../../shared/components/ui/modal/import-csv-modal/import-csv-modal.component";
import { Store } from "@ngxs/store";
import { MemberState } from "../../../shared/store/state/member.state";
import { Observable, Subject, takeUntil } from "rxjs";
import { UserModel } from "../../../shared/interface/user.interface";
import {
  TableClickedAction,
  TableConfig,
} from "../../../shared/interface/table.interface";
import { Params } from "../../../shared/interface/core.interface";
import {
  DeleteAllMember,
  DeleteMember,
  ExportMember,
  GetExitedMembers,
  GetStatistics,
  UpdateMemberStatus,
  ReactivateMember,
} from "../../../shared/store/action/member.action";
import { HasPermissionDirective } from "../../../shared/directive/has-permission.directive";
import { CommonModule } from "@angular/common";
import { UserService } from "src/app/core/services/user.service";
import { appConfig } from "src/app/core/config/config";
import { NotificationService } from "src/app/shared/services/notification.service";

@Component({
  selector: "app-exited-members",
  imports: [
    RouterModule,
    TranslateModule,
    HasPermissionDirective,
    PageWrapperComponent,
    TableComponent,
    ImportCsvModalComponent,
    CommonModule,
  ],
  templateUrl: "./exited-members.component.html",
  styleUrl: "./exited-members.component.scss",
})
export class ExitedMembersComponent {
  private destroy$ = new Subject<void>();
  private store = inject(Store);
  allUsers: any[];
  member$: Observable<UserModel[]> = this.store.select(
    MemberState.exited_member
  );
  isLoading$: Observable<boolean> = this.store.select(MemberState.isLoading);
  statistics$: Observable<any | null> = inject(Store).select(
    MemberState.statistics
  ) as Observable<any>;

  @ViewChild("csvModal") CSVModal: ImportCsvModalComponent;

  @ViewChild(TableComponent) confirmAction: TableComponent; // Get reference to the modal component in the table component

  public tableConfig: TableConfig = {
    columns: [
      { title: "Exit Date", dataField: "createdAt", type: "date" },
      { title: "Member ID", dataField: "member_id" },
      {
        title: "First name",
        dataField: "first_name",
        sortable: true,
        sort_direction: "desc",
      },
      {
        title: "Last name",
        dataField: "last_name",
        sortable: true,
        sort_direction: "desc",
      },
      { title: "Status", dataField: "is_activated", type: "switch" },
    ],
    rowActions: [
      // { label: "Edit", actionToPerform: "edit", icon: "ri-pencil-line", permission: "user.edit" },
      {
        label: "Delete",
        actionToPerform: "reactivate",
        icon: "ri-refresh-line",
        permission: "user.destroy",
      },
    ],
    data: [] as any,
    total: 0,
  };

  constructor(
    private notificationService: NotificationService,
    private userService: UserService,
    public router: Router
  ) {}

  ngOnInit() {
    this.getUsers();
    this.getStatistics();
    this.member$.pipe(takeUntil(this.destroy$)).subscribe((data) => {
      let members = data?.filter((member: any) => {
        member.phone = member?.phone
          ? `+${member?.dial_code}${member?.phone}`
          : "-";
        return member;
      });
      this.tableConfig.data = data ? members : [];
      this.tableConfig.total = data.length;
    });
  }

  getStatistics(): void {
    this.store.dispatch(new GetStatistics({}));
  }

  getUsers(): void {
    this.store.dispatch(new GetExitedMembers({ role: "admin" }));
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onTableChange(data?: Params) {
    console.log("Params :::", data);
    // this.getUsers(); // handle filter/pagination later
    this.store.dispatch(new GetExitedMembers(data));
  }

  onActionClicked(action: TableClickedAction) {
    if (action.actionToPerform == "edit") this.edit(action.data);
    else if (action.actionToPerform == "reactivate") this.status(action.data);
    else if (action.actionToPerform == "detail") this.view(action.data);
    else if (action.actionToPerform == "delete") this.delete(action.data);
    else if (action.actionToPerform == "deleteAll") this.deleteAll(action.data);
  }

  edit(data: any) {
    // this.router.navigateByUrl(`/registration/edit-member/${data.id}`);
    this.store
      .dispatch(new UpdateMemberStatus(data.id, data.is_activated))
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          console.log("Status update ::::::", res);
          const response = res?.member?.response;
          if (response.status === appConfig.statusCode.ok) {
            this.notificationService.showSuccess(response.message);
            this.getUsers(); // Refresh the list after status update
          }
        },
        error: (err) => {
          this.notificationService.showError(
            err?.message || "Failed to update user status"
          );
        },
      });
  }
  view(data: any) {
    this.router.navigateByUrl(`/user/detail/${data.id}`);
  }

  status(data: any) {
    this.store
      .dispatch(new ReactivateMember(data.id))
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          const response = res?.member?.response;
          if (response.status === appConfig.statusCode.ok) {
            this.notificationService.showSuccess(response.message);
          }
        },
        error: (err) => {
          this.notificationService.showError(
            err?.message || "Failed to update user status"
          );
        },
      });
  }

  delete(data: any) {
    this.store
      .dispatch(new DeleteMember(data.id))
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          const response = res?.member?.response;
          if (response.status === appConfig.statusCode.ok) {
            this.notificationService.showSuccess(response.message);
            this.getUsers(); // Refresh the list after status update
          }
        },
        error: (err) => {
          this.notificationService.showError(
            err?.message || "Failed to delete user!"
          );
        },
      });
  }

  deleteAll(ids: number[]) {
    this.store
      .dispatch(new DeleteAllMember(ids))
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          const response = res?.member?.response;
          if (response.status === appConfig.statusCode.ok) {
            this.notificationService.showSuccess(response.message);
            this.getUsers();
          }
        },
        error: (err) => {
          this.notificationService.showError(
            err?.message || "Failed to delete user!"
          );
        },
      });
  }

  export() {
    this.store.dispatch(new ExportMember());
  }
}
