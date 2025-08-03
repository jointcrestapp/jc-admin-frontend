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
  GetProductPlans,
  DeleteProductPlan,
} from "src/app/shared/store/action/configurations.action";
import { appConfig } from "src/app/core/config/config";
import { NotificationService } from "src/app/shared/services/notification.service";
import { HasPermissionDirective } from "src/app/shared/directive/has-permission.directive";

@Component({
  selector: "app-all-product-plans",
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
  templateUrl: "./all-product-plans.component.html",
  styleUrl: "./all-product-plans.component.scss",
})
export class AllProductPlansComponent {
  private destroy$ = new Subject<void>();

  public product_plans$: Observable<any>;
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
      { title: "Rate (%)", dataField: "rate" },
      { title: "Cal Method Repayment", dataField: "cal_method" },
      { title: "Min Month", dataField: "min_month" },
      { title: "Max Month", dataField: "max_month" },
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

    this.product_plans$ = this.store.select(ConfigurationsState.product_plans);
    this.isLoading$ = this.store.select(ConfigurationsState.isLoading);
    this.setting$ = this.store.select(SettingState.setting);

    this.setting$.subscribe((setting) => {
      if (setting && setting.general) {
        this.url = setting.general.site_url;
      }
    });
  }

  ngOnInit() {
    this.getProductPlans();
    this.product_plans$
      .pipe(takeUntil(this.destroy$))
      .subscribe((prod_plan) => {
        let product_plans = prod_plan?.data?.filter((element: any) => {
          // cat.tier.currency = cat?.tier?.currency ? cat?.tier.currency : "";
          return element;
        });
        this.tableConfig.data = prod_plan ? product_plans : [];
        this.tableConfig.total = prod_plan ? prod_plan?.total : 0;
      });
  }

  getProductPlans() {
    this.store.dispatch(new GetProductPlans({}));
  }

  onTableChange(data?: Params) {
    this.filter = { ...this.filter, ...data };
    this.store.dispatch(new GetProductPlans(this.filter));
  }

  navigateToAddProductPan() {
    // Store the current tab info before navigation
    sessionStorage.setItem("categoriesActiveTab", "product_plan");

    // Navigate to add-loan-type page with return information
    this.router.navigate(
      ["/configurations/product/product-plan/add-product-plan"],
      {
        queryParams: {
          returnTab: "product_plan",
          returnUrl: "/configurations/categories",
        },
      }
    );
  }

  onActionClicked(action: TableClickedAction) {
    if (action.actionToPerform == "edit") this.edit(action.data);
    else if (action.actionToPerform == "delete") this.delete(action.data);
  }

  edit(data: any) {
    this.router.navigateByUrl(
      `/configurations/product/product-plan/edit-product-plan/${data.id}`
    );
  }

  delete(data: any) {
    this.store
      .dispatch(new DeleteProductPlan(data.id))
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          const response = res?.configurations?.response;
          if (response.status === appConfig.statusCode.ok) {
            this.notificationService.showSuccess(response.message);
            this.getProductPlans();
          }
        },
        error: (err) => {
          this.notificationService.showError(
            err?.message || "Failed to delete Product Plan!"
          );
        },
      });
  }
}
