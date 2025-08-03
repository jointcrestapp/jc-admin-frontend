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
  GetSharesReport,
  ExportReport,
} from "src/app/shared/store/action/report.action";
import { NotificationService } from "src/app/shared/services/notification.service";

@Component({
  selector: "app-shares-report",
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
  templateUrl: "./shares-report.component.html",
  styleUrl: "./shares-report.component.scss",
})
export class SharesReportComponent {
  private destroy$ = new Subject<void>();

  shares_report$: Observable<any> = inject(Store).select(
    ReportState.shares_report
  ) as Observable<any>;

  isLoading$: Observable<any> = inject(Store).select(
    ReportState.isLoading
  ) as Observable<any>;
  setting$: Observable<Values> = inject(Store).select(
    SettingState.setting
  ) as Observable<Values>;

  @ViewChild("csvModal") CSVModal: ImportCsvModalComponent;
  @ViewChild("downloadModal") DownloadModal: DigitalDownloadModalComponent;

  public sharesType: Select2Data = [
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
      { title: "Credit", dataField: "credit", type: "price" },
      { title: "Debit", dataField: "debit", type: "price" },
      { title: "Balance", dataField: "balance", type: "price" },
    ],
    rowActions: [],
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
    this.setting$.subscribe((setting) => {
      if (setting && setting.general) {
        this.url = setting.general.site_url;
      }
    });
  }

  ngOnInit() {
    this.getSharesReport();
    this.shares_report$.pipe(takeUntil(this.destroy$)).subscribe((sr) => {
      let savings_report = sr?.data?.filter((element: any) => {
        return element;
      });
      this.tableConfig.data = sr ? sr : [];
      this.tableConfig.total = sr ? sr?.total : 0;
    });
  }

  getSharesReport() {
    this.store.dispatch(new GetSharesReport({}));
  }

  onTableChange(data?: Params) {
    this.filter = { ...this.filter, ...data };
    this.store.dispatch(new GetSharesReport(this.filter));
  }

  applyFilter(data: Select2UpdateEvent) {
    this.filter["shares_type"] = data && data.value ? data.value : null;
    if (!this.filter["shares_type"]) {
      delete this.filter["shares_type"];
    }
    this.onTableChange(this.filter);
  }

  export() {
    this.store
      .dispatch(new ExportReport("shares_report"))
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          console.log("Export completed successfully:", res);
        },
        error: (err) => {
          console.error("Export failed:", err);
          this.notificationService.showError(
            err?.message || "Failed to export shares report"
          );
        },
      });
  }
}
