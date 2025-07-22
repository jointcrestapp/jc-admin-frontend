import {
  Component,
  inject,
  Inject,
  PLATFORM_ID,
  Renderer2,
  ViewChild,
} from "@angular/core";
import { Store } from "@ngxs/store";
import { SettingState } from "../../../../shared/store/state/setting.state";
import { Observable, Subject, takeUntil } from "rxjs";
import { Values } from "../../../../shared/interface/setting.interface";
import { Select2Module, Select2UpdateEvent } from "ng-select2-component";
import { ImportCsvModalComponent } from "../../../../shared/components/ui/modal/import-csv-modal/import-csv-modal.component";
import { DigitalDownloadModalComponent } from "../../../../shared/components/ui/modal/digital-download-modal/digital-download-modal.component";
import { Params, Router, RouterModule } from "@angular/router";
import { TableConfig } from "../../../../shared/interface/table.interface";
import { CommonModule, DOCUMENT, isPlatformBrowser } from "@angular/common";

import { TranslateModule } from "@ngx-translate/core";
import { PageWrapperComponent } from "../../../../shared/components/page-wrapper/page-wrapper.component";
import { TableComponent } from "../../../../shared/components/ui/table/table.component";
import { HasPermissionDirective } from "../../../../shared/directive/has-permission.directive";
import { ReportState } from "src/app/shared/store/state/reports.state";
import { GetCreditSalesReport } from "src/app/shared/store/action/report.action";
import { NotificationService } from "src/app/shared/services/notification.service";
import { ConfigurationsState } from "src/app/shared/store/state/configurations.state";
import { GetProductPlans } from "src/app/shared/store/action/configurations.action";

@Component({
  selector: "app-credit-sales-report",
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule,
    HasPermissionDirective,
    Select2Module,
    PageWrapperComponent,
    TableComponent,
    ImportCsvModalComponent,
    DigitalDownloadModalComponent,
  ],
  templateUrl: "./credit-sales-report.component.html",
  styleUrl: "./credit-sales-report.component.scss",
})
export class CreditSalesReportComponent {
  private destroy$ = new Subject<void>();

  credit_sales_report$: Observable<any> = inject(Store).select(
    ReportState.credit_sales_report
  ) as Observable<any>;

  product_types$: Observable<any> = inject(Store).select(
    ConfigurationsState.product_plans
  ) as Observable<any>;

  isLoading$: Observable<any> = inject(Store).select(
    ReportState.isLoading
  ) as Observable<any>;
  setting$: Observable<Values> = inject(Store).select(
    SettingState.setting
  ) as Observable<Values>;

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
      { title: "Status", dataField: "status", type: "transition" },
      { title: "Principal", dataField: "total_principal", type: "price" },
      { title: "Interest", dataField: "total_interest", type: "price" },
      { title: "Total", dataField: "total_balance", type: "price" },
      {
        title: "Principal Monthly",
        dataField: "principal_monthly",
        type: "price",
      },
      {
        title: "Interest Monthly",
        dataField: "interest_monthly",
        type: "price",
      },
      { title: "Total Monthly", dataField: "total_monthly", type: "price" },
      {
        title: "Principal Balance",
        dataField: "principal_balance",
        type: "price",
      },
      {
        title: "Total Balance",
        dataField: "total_balance_remaining",
        type: "price",
      },
    ],
    rowActions: [],
    data: [] as any[],
    total: 0,
  };
  product_plans: any;

  constructor(
    private store: Store,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: object,
    private notificationService: NotificationService,
    private router: Router
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.setting$.subscribe((setting) => {
      if (setting && setting.general) {
        this.url = setting.general.site_url;
      }
    });
  }

  ngOnInit() {
    this.getCreditSalesReport();
    this.getProductPlan();

    this.product_types$.pipe(takeUntil(this.destroy$)).subscribe((pt) => {
      this.product_plans = pt?.data.filter((element: any) => {
        element.value = element.id;
        element.label = element.name;
        return element;
      });
    });

    this.credit_sales_report$
      .pipe(takeUntil(this.destroy$))
      .subscribe((csr) => {
        let credit_sales_report = csr?.filter((element: any) => {
          element.status =
            element.status === 0
              ? `<div class="status-pending"><span>Requested</span></div>`
              : element.status === 1
              ? `<div class="status-approved"><span>Approved</span></div>`
              : `<div class="status-delivered"><span>Dispatched</span></div>`;
          return element;
        });
        this.tableConfig.data = csr ? csr : [];
        this.tableConfig.total = csr ? csr?.total : 0;
      });
  }

  getProductPlan() {
    this.store.dispatch(new GetProductPlans({}));
  }

  getCreditSalesReport() {
    this.store.dispatch(new GetCreditSalesReport({}));
  }

  onTableChange(data?: Params) {
    this.filter = { ...this.filter, ...data };
    this.store.dispatch(new GetCreditSalesReport(this.filter));
  }

  applyFilter(data: Select2UpdateEvent) {
    this.filter["product_plan"] = data && data.value ? data.value : null;
    if (!this.filter["product_plan"]) {
      delete this.filter["product_plan"];
    }
    this.onTableChange(this.filter);
  }
}
