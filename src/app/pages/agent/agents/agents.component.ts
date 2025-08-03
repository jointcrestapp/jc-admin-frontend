import {
  Component,
  Inject,
  inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  Renderer2,
  ViewChild,
} from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { PageWrapperComponent } from "../../../shared/components/page-wrapper/page-wrapper.component";
import { TableComponent } from "../../../shared/components/ui/table/table.component";
import { ImportCsvModalComponent } from "../../../shared/components/ui/modal/import-csv-modal/import-csv-modal.component";
import { Store } from "@ngxs/store";
import { MemberState } from "../../../shared/store/state/member.state";
import { Observable, Subject, takeUntil } from "rxjs";
import {
  TableClickedAction,
  TableConfig,
} from "../../../shared/interface/table.interface";
import { Params } from "../../../shared/interface/core.interface";
import {
  DeleteAllMember,
  DeleteMember,
  ExportMember,
  GetAgents,
  UpdateMemberStatus,
} from "../../../shared/store/action/member.action";
import { HasPermissionDirective } from "../../../shared/directive/has-permission.directive";
import { CommonModule, DOCUMENT, isPlatformBrowser } from "@angular/common";
import { UserService } from "src/app/core/services/user.service";
import { appConfig } from "src/app/core/config/config";
import { NotificationService } from "src/app/shared/services/notification.service";
import {
  Select2Data,
  Select2Module,
  Select2Option,
  Select2UpdateEvent,
} from "ng-select2-component";

@Component({
  selector: "app-agents",
  imports: [
    RouterModule,
    TranslateModule,
    Select2Module,
    HasPermissionDirective,
    PageWrapperComponent,
    TableComponent,
    ImportCsvModalComponent,
    CommonModule,
  ],
  templateUrl: "./agents.component.html",
  styleUrl: "./agents.component.scss",
})
export class AgentsComponent {
  private destroy$ = new Subject<void>();
  private store = inject(Store);
  allUsers: any[];
  agents$: Observable<any> = this.store.select(MemberState.agents);
  isLoading$: Observable<boolean> = this.store.select(MemberState.isLoading);
  statistics$: Observable<any | null> = inject(Store).select(
    MemberState.statistics
  ) as Observable<any>;

  @ViewChild("csvModal") CSVModal: ImportCsvModalComponent;

  @ViewChild(TableComponent) confirmAction: TableComponent; // Get reference to the modal component in the table component

  public memberStatus: Select2Data = [
    {
      value: "0",
      label: "Inactive",
    },
    {
      value: "1",
      label: "Active",
    },
  ];

  public filter: Params = {
    search: "",
    field: "",
    status: "",
    sort: "", // current Sorting Order
    page: 1, // current page number
    paginate: 15, // Display per page,
  };

  public open: boolean = true;
  public isBrowser: boolean;

  public tableConfig: TableConfig = {
    columns: [
      { title: "Date", dataField: "createdAt", type: "date" },
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
      { title: "phone", dataField: "phone" },
      { title: "Email", dataField: "email" },
      { title: "Role", dataField: "role_name" },
      { title: "Status", dataField: "is_activated", type: "switch" },
    ],
    rowActions: [
      {
        label: "Edit",
        actionToPerform: "edit",
        icon: "ri-pencil-line",
        permission: "user.edit",
      },
      {
        label: "Delete",
        actionToPerform: "delete",
        icon: "ri-delete-bin-line",
        permission: "user.destroy",
      },
    ],
    data: [] as any,
    total: 0,
  };

  constructor(
    private notificationService: NotificationService,
    private userService: UserService,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: object,
    private renderer: Renderer2,
    public router: Router
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    this.getUsers();
    this.agents$.pipe(takeUntil(this.destroy$)).subscribe((agent: any) => {
      let agents = agent?.data?.filter((agent: any) => {
        agent.phone = agent?.phone
          ? `+${agent?.dial_code}${agent?.phone}`
          : "-";
        return agent;
      });
      this.tableConfig.data = agent ? agents : [];
      this.tableConfig.total = agent ? agent?.total : 0;
    });
  }

  getUsers(): void {
    this.store.dispatch(new GetAgents({ role: "agent" }));
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onTableChange(data?: Params) {
    this.filter = { ...data, ...this.filter };
    this.store.dispatch(new GetAgents(this.filter));
  }

  onActionClicked(action: TableClickedAction) {
    if (action.actionToPerform == "edit") this.edit(action.data);
    else if (action.actionToPerform == "is_activated") this.status(action.data);
    else if (action.actionToPerform == "detail") this.view(action.data);
    else if (action.actionToPerform == "delete") this.delete(action.data);
    else if (action.actionToPerform == "deleteAll") this.deleteAll(action.data);
  }

  edit(data: any) {
    this.router.navigateByUrl(`/registration/edit-member/${data.id}`);
  }
  view(data: any) {
    this.router.navigateByUrl(`/user/detail/${data.id}`);
  }

  applyFilter(data: Select2UpdateEvent) {
    this.filter["status"] = data && data.value ? data.value : null;
    if (!this.filter["status"]) {
      delete this.filter["status"];
    }
    this.onTableChange(this.filter);
  }

  filters(data: any, key: string) {
    console.log("Filters ::::", {
      data,
      key,
    });
    this.renderer.addClass(this.document.body, "loader-none");
    console.log(data && data.value);
    if (data && data.value) {
      this.filter[key] = data.value;
    } else {
      this.filter[key] = [];
    }
    this.onTableChange(this.filter);
  }

  status(data: any) {
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

  delete(data: any) {
    this.store
      .dispatch(new DeleteMember(data.id))
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          const response = res?.member?.response;
          if (response.status === appConfig.statusCode.ok) {
            this.notificationService.showSuccess(response.message);
            // this.getUsers();  // Refresh the list after status update
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
    this.store
      .dispatch(new ExportMember("agents"))
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          console.log("Export completed successfully:", res);
        },
        error: (err) => {
          console.error("Export failed:", err);
          this.notificationService.showError(
            err?.message || "Failed to export agents"
          );
        },
      });
  }
}
