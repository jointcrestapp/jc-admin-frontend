import {
  Component,
  Inject,
  PLATFORM_ID,
  Renderer2,
  ViewChild,
} from "@angular/core";
import { Store } from "@ngxs/store";
import { SettingState } from "../../../../../shared/store/state/setting.state";
import { Observable, Subject, takeUntil } from "rxjs";
import { Values } from "../../../../../shared/interface/setting.interface";
import { Select2Module } from "ng-select2-component";
import { ImportCsvModalComponent } from "../../../../../shared/components/ui/modal/import-csv-modal/import-csv-modal.component";
import { DigitalDownloadModalComponent } from "../../../../../shared/components/ui/modal/digital-download-modal/digital-download-modal.component";
import { Params, Router, RouterModule } from "@angular/router";
import {
  TableClickedAction,
  TableConfig,
} from "../../../../../shared/interface/table.interface";
import { CommonModule, DOCUMENT, isPlatformBrowser } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { PageWrapperComponent } from "../../../../../shared/components/page-wrapper/page-wrapper.component";
import { TableComponent } from "../../../../../shared/components/ui/table/table.component";
import { ConfigurationsState } from "src/app/shared/store/state/configurations.state";
import {
  GetSharesTypes,
  UpdateSharesTypeStatus,
} from "src/app/shared/store/action/configurations.action";
import { appConfig } from "src/app/core/config/config";
import { NotificationService } from "src/app/shared/services/notification.service";
import { HasPermissionDirective } from "src/app/shared/directive/has-permission.directive";

@Component({
  selector: "app-all-shares-type",
  imports: [
    CommonModule,
    TranslateModule,
    HasPermissionDirective,
    RouterModule,
    Select2Module,
    PageWrapperComponent,
    TableComponent,
    ImportCsvModalComponent,
    DigitalDownloadModalComponent,
  ],
  templateUrl: "./all-shares-type.component.html",
  styleUrl: "./all-shares-type.component.scss",
})
export class AllSharesTypeComponent {
  private destroy$ = new Subject<void>();

  public share_types$: Observable<any>;
  public isLoading$: Observable<any>;
  public setting$: Observable<Values>;

  @ViewChild("csvModal") CSVModal: ImportCsvModalComponent;
  @ViewChild("downloadModal") DownloadModal: DigitalDownloadModalComponent;

  public filter: Params = {
    search: "",
    field: "",
    country: "",
    month: "",
    year: "",
    sort: "", // current Sorting Order
    page: 1, // current page number
    paginate: 15, // Display per page,
  };

  public advanceFilter: any[] = [];
  public url: string;
  public open: boolean = true;
  public isBrowser: boolean;

  public tableConfig: TableConfig = {
    columns: [
      { title: "Date", dataField: "date", type: "date" },
      { title: "name", dataField: "name" },
      { title: "Max Withdrawal (%)", dataField: "max_withdrawal" },
      { title: "status", dataField: "is_activated", type: "switch" },
    ],
    rowActions: [
      {
        label: "Edit",
        actionToPerform: "edit",
        icon: "ri-pencil-line",
        permission: "configurations.edit",
      },
    ],
    data: [] as any[],
    total: 0,
  };

  constructor(
    private store: Store,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: object,
    private notificationService: NotificationService,
    private router: Router
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    this.share_types$ = this.store.select(ConfigurationsState.share_types);
    this.isLoading$ = this.store.select(ConfigurationsState.isLoading);
    this.setting$ = this.store.select(SettingState.setting);

    this.setting$.subscribe((setting) => {
      if (setting && setting.general) {
        this.url = setting.general.site_url;
      }
    });
  }

  ngOnInit() {
    this.getShareTypes();
    this.share_types$.pipe(takeUntil(this.destroy$)).subscribe((st) => {
      let share_types = st?.data?.filter((element: any) => {
        // cat.tier.currency = cat?.tier?.currency ? cat?.tier.currency : "";
        return element;
      });
      this.tableConfig.data = st ? share_types : [];
      this.tableConfig.total = st ? st?.total : 0;
    });
  }

  getShareTypes() {
    this.store.dispatch(new GetSharesTypes({}));
  }

  onTableChange(data?: Params) {
    this.filter = { ...this.filter, ...data };
    this.store.dispatch(new GetSharesTypes(this.filter));
  }

  onActionClicked(action: TableClickedAction) {
    if (action.actionToPerform == "edit") this.edit(action.data);
    else if (action.actionToPerform == "is_activated") this.status(action.data);
    // else if (action.actionToPerform == "delete") this.delete(action.data);
  }

  navigateToAddSharesType() {
    // Store the current tab info before navigation
    sessionStorage.setItem("categoriesActiveTab", "shares_type");

    // Navigate to add-loan-type page with return information
    this.router.navigate(["/configurations/share-type/add-share-type"], {
      queryParams: {
        returnTab: "shares_type",
        returnUrl: "/configurations/categories",
      },
    });
  }

  edit(data: any) {
    this.router.navigateByUrl(
      `/configurations/share-type/edit-share-type/${data.id}`
    );
  }

  status(data: any) {
    this.store
      .dispatch(new UpdateSharesTypeStatus(data.is_activated, data.id))
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          console.log("Status update ::::::", res);
          const response = res?.configurations?.response;
          if (response.status === appConfig.statusCode.ok) {
            this.notificationService.showSuccess(response.message);
            this.getShareTypes(); // Refresh the list after status update
          }
        },
        error: (err) => {
          this.notificationService.showError(
            err?.message || "Failed to update share status"
          );
        },
      });
  }

  // delete(data: any) {
  //   this.store
  //     .dispatch(new DeleteLoanType(data.id))
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe({
  //       next: (res: any) => {
  //         const response = res?.configurations?.response;
  //         if (response.status === appConfig.statusCode.ok) {
  //           this.notificationService.showSuccess(response.message);
  //           this.getLoanTypes();
  //         }
  //       },
  //       error: (err) => {
  //         this.notificationService.showError(
  //           err?.message || "Failed to delete Loan Type!"
  //         );
  //       },
  //     });
  // }
}
