import {
  Component,
  Inject,
  PLATFORM_ID,
  Renderer2,
  ViewChild,
} from "@angular/core";
import { Store } from "@ngxs/store";
import { SettingState } from "../../../../../../shared/store/state/setting.state";
import { Observable, Subject, takeUntil } from "rxjs";
import { Values } from "../../../../../../shared/interface/setting.interface";
import { Select2Module } from "ng-select2-component";
import { ImportCsvModalComponent } from "../../../../../../shared/components/ui/modal/import-csv-modal/import-csv-modal.component";
import { DigitalDownloadModalComponent } from "../../../../../../shared/components/ui/modal/digital-download-modal/digital-download-modal.component";
import { Params, Router, RouterModule } from "@angular/router";
import {
  TableClickedAction,
  TableConfig,
} from "../../../../../../shared/interface/table.interface";
import { CommonModule, DOCUMENT, isPlatformBrowser } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { PageWrapperComponent } from "../../../../../../shared/components/page-wrapper/page-wrapper.component";
import { TableComponent } from "../../../../../../shared/components/ui/table/table.component";
import { ConfigurationsState } from "src/app/shared/store/state/configurations.state";
import {
  GetVendors,
  DeleteVendor,
} from "src/app/shared/store/action/configurations.action";
import { appConfig } from "src/app/core/config/config";
import { NotificationService } from "src/app/shared/services/notification.service";
import { HasPermissionDirective } from "src/app/shared/directive/has-permission.directive";

@Component({
  selector: "app-all-vendors",
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
  templateUrl: "./all-vendors.component.html",
  styleUrl: "./all-vendors.component.scss",
  standalone:true
})
export class AllVendorsComponent {
  private destroy$ = new Subject<void>();

  public vendors$: Observable<any>;
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
      { title: "description", dataField: "description" },
    ],
    rowActions: [
      {
        label: "Edit",
        actionToPerform: "edit",
        icon: "ri-pencil-line",
        permission: "configurations.edit",
      },
      {
        label: "Delete",
        actionToPerform: "delete",
        icon: "ri-delete-bin-line",
        permission: "configurations.destroy",
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

    this.vendors$ = this.store.select(ConfigurationsState.vendors);
    this.isLoading$ = this.store.select(ConfigurationsState.isLoading);
    this.setting$ = this.store.select(SettingState.setting);

    this.setting$.subscribe((setting) => {
      if (setting && setting.general) {
        this.url = setting.general.site_url;
      }
    });
  }

  ngOnInit() {
    this.getVendors();
    this.vendors$.pipe(takeUntil(this.destroy$)).subscribe((vendor) => {
      console.log("Vendors :::::::::::::::", vendor);
      let vendors = vendor?.data?.filter((element: any) => {
        // cat.tier.currency = cat?.tier?.currency ? cat?.tier.currency : "";
        return element;
      });
      this.tableConfig.data = vendor ? vendors : [];
      this.tableConfig.total = vendor ? vendor?.total : 0;
    });
  }

  getVendors() {
    this.store.dispatch(new GetVendors({}));
  }

  onTableChange(data?: Params) {
    this.filter = { ...this.filter, ...data };
    this.store.dispatch(new GetVendors(this.filter));
  }

  onActionClicked(action: TableClickedAction) {
    if (action.actionToPerform == "edit") this.edit(action.data);
    else if (action.actionToPerform == "delete") this.delete(action.data);
  }

  navigateToAddVendor() {
    // Store the current tab info before navigation
    sessionStorage.setItem("categoriesActiveTab", "vendors");

    // Navigate to add-loan-type page with return information
    this.router.navigate(["/configurations/product/vendors/add-vendor"], {
      queryParams: {
        returnTab: "vendors",
        returnUrl: "/configurations/categories",
      },
    });
  }

  edit(data: any) {
    this.router.navigateByUrl(
      `/configurations/product/vendors/edit-vendor/${data.id}`
    );
  }

  delete(data: any) {
    this.store
      .dispatch(new DeleteVendor(data.id))
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          const response = res?.configurations?.response;
          if (response.status === appConfig.statusCode.ok) {
            this.notificationService.showSuccess(response.message);
            this.getVendors();
          }
        },
        error: (err) => {
          this.notificationService.showError(
            err?.message || "Failed to delete investment type!"
          );
        },
      });
  }
}
