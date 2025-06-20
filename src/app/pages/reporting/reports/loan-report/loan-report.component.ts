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
import { Observable, Subject, switchMap, take, takeUntil } from "rxjs";
import { Product } from "../../../../shared/interface/product.interface";
import { Values } from "../../../../shared/interface/setting.interface";
import {
  Select2Data,
  Select2Module,
  Select2UpdateEvent,
} from "ng-select2-component";
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
import {
  SetLoadingState,
  GetLoanReport,
} from "src/app/shared/store/action/report.action";
import { NotificationService } from "src/app/shared/services/notification.service";
import { LoanState } from "src/app/shared/store/state/loan.state";
import { GetLoanType } from "src/app/shared/store/action/loan.action";

@Component({
  selector: "app-loan-report",
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
  templateUrl: "./loan-report.component.html",
  styleUrl: "./loan-report.component.scss",
})
export class LoanReportComponent {
  private destroy$ = new Subject<void>();

  loan_report$: Observable<any> = inject(Store).select(
    ReportState.loan_report
  ) as Observable<any>;

  loan_type$: Observable<any> = inject(Store).select(
    LoanState.loan_type
  ) as Observable<any>;

  isLoading$: Observable<any> = inject(Store).select(
    ReportState.isLoading
  ) as Observable<any>;
  setting$: Observable<Values> = inject(Store).select(
    SettingState.setting
  ) as Observable<Values>;

  @ViewChild("csvModal") CSVModal: ImportCsvModalComponent;
  @ViewChild("downloadModal") DownloadModal: DigitalDownloadModalComponent;

  public savingsType: Select2Data = [
    {
      value: "savings",
      label: "Savings",
    },
    {
      value: "withdrawal",
      label: "Withdrawal",
    },
  ];

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
    data: [] as Product[],
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
    this.setting$.subscribe((setting) => {
      if (setting && setting.general) {
        this.url = setting.general.site_url;
      }
    });
  }

  ngOnInit() {
    this.getLoanReport();
    this.store
      .dispatch(new GetLoanType({}))
      .pipe(
        take(1),
        switchMap(() => this.loan_type$),
        takeUntil(this.destroy$)
      )
      .subscribe((loanTypes) => {
        this.loan_report$.pipe(takeUntil(this.destroy$)).subscribe((lr) => {
          let loan_report = lr?.data?.filter((element: any) => {
            return element;
          });
          this.tableConfig.data = lr ? lr : [];
          this.tableConfig.total = lr ? lr?.total : 0;
        });
      });
  }

  getLoanReport() {
    this.store.dispatch(new GetLoanReport({}));
  }

  onTableChange(data?: Params) {
    this.filter = { ...this.filter, ...data };
    this.store.dispatch(new GetLoanReport(this.filter));
  }

  applyFilter(data: Select2UpdateEvent) {
    this.filter["loan_type"] = data && data.value ? data.value : null;
    if (!this.filter["loan_type"]) {
      delete this.filter["loan_type"];
    }
    this.onTableChange(this.filter);
  }

  // export() {
  //   this.store.dispatch(new ExportProduct(this.filter));
  // }
}
