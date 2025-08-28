import {
  Component,
  inject,
  Inject,
  PLATFORM_ID,
  Renderer2,
  ViewChild,
} from "@angular/core";
import { Store } from "@ngxs/store";
import { Observable, Subject, takeUntil } from "rxjs";
import { Product } from "../../../shared/interface/product.interface";
import {
  Select2Data,
  Select2Module,
  Select2UpdateEvent,
} from "ng-select2-component";
import { ImportCsvModalComponent } from "../../../shared/components/ui/modal/import-csv-modal/import-csv-modal.component";
import { DigitalDownloadModalComponent } from "../../../shared/components/ui/modal/digital-download-modal/digital-download-modal.component";
import { Params, Router, RouterModule } from "@angular/router";
import {
  TableClickedAction,
  TableConfig,
} from "../../../shared/interface/table.interface";
import { CommonModule, DOCUMENT, isPlatformBrowser } from "@angular/common";
import {
  DeleteAllProduct,
  Download,
  ReplicateProduct,
  UpdateProductStatus,
} from "../../../shared/store/action/product.action";
import { TranslateModule } from "@ngx-translate/core";
import { PageWrapperComponent } from "../../../shared/components/page-wrapper/page-wrapper.component";
import { TableComponent } from "../../../shared/components/ui/table/table.component";
import { HasPermissionDirective } from "../../../shared/directive/has-permission.directive";
import { CurrencySymbolPipe } from "../../../shared/pipe/currency-symbol.pipe";
import {
  ExportCredits,
  PaidCreditSalesHistory,
} from "src/app/shared/store/action/credit.action";
import { appConfig } from "src/app/core/config/config";
import { NotificationService } from "src/app/shared/services/notification.service";
import { CreditState } from "src/app/shared/store/state/credit.state";

@Component({
  selector: "app-repayment",
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule,
    Select2Module,
    PageWrapperComponent,
    TableComponent,
    ImportCsvModalComponent,
    DigitalDownloadModalComponent,
    CurrencySymbolPipe,
  ],
  templateUrl: "./repayment.component.html",
  styleUrl: "./repayment.component.scss",
  standalone: true,
})
export class RepaymentComponent {
  private destroy$ = new Subject<void>();

  paid_credit_sales$: Observable<any> = inject(Store).select(
    CreditState.paid_credit_sales
  ) as Observable<any>;
  statistics$: Observable<any | null> = inject(Store).select(
    CreditState.statistics
  ) as Observable<any>;
  isLoading$: Observable<any> = inject(Store).select(
    CreditState.isLoading
  ) as Observable<any>;

  @ViewChild("csvModal") CSVModal: ImportCsvModalComponent;
  @ViewChild("downloadModal") DownloadModal: DigitalDownloadModalComponent;
  public years: Select2Data;

  public months: Select2Data = [
    {
      value: 1,
      label: "January",
    },
    {
      value: 2,
      label: "Feburary",
    },
    {
      value: 3,
      label: "March",
    },
    {
      value: 4,
      label: "April",
    },
    {
      value: 5,
      label: "May",
    },
    {
      value: 6,
      label: "June",
    },
    {
      value: 7,
      label: "July",
    },
    {
      value: 8,
      label: "August",
    },
    {
      value: 9,
      label: "September",
    },
    {
      value: 10,
      label: "October",
    },
    {
      value: 11,
      label: "November",
    },
    {
      value: 12,
      label: "December",
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
      { title: "Payment Date", dataField: "payment_date", type: "date" },
      { title: "Member ID", dataField: "member_id" },
      {
        title: "Full Name",
        dataField: "full_name",
        sortable: true,
        sort_direction: "desc",
      },
      {
        title: "Amount Paid",
        dataField: "amount_paid",
        type: "price",
      },
      {
        title: "Due Amount",
        dataField: "due_amount",
        type: "price",
      },
      {
        title: "Balance",
        dataField: "remaining_balance",
        type: "price",
      },
      {
        title: "Product",
        dataField: "product_name",
      },
      {
        title: "Category",
        dataField: "category",
      },
      {
        title: "Product Plan",
        dataField: "product_plan_name",
      },
      {
        title: "Principal",
        dataField: "original_principal",
        type: "price",
      },
      { title: "Total Due", dataField: "original_total_due", type: "price" },
      { title: "Interest", dataField: "original_interest", type: "price" },
      {
        title: "Monthly Due",
        dataField: "monthly_due",
        type: "price",
      },
      {
        title: "Status",
        dataField: "payment_progress",
      },
    ],
    rowActions: [
      // {
      //   label: "View",
      //   actionToPerform: "view",
      //   icon: "ri-printer-line",
      //   permission: "credit.index",
      // },
      // {
      //   label: "Approved",
      //   actionToPerform: "reactivate",
      //   icon: "ri-check-line",
      //   permission: "credit.edit",
      // },
      // {
      //   label: "Delete",
      //   actionToPerform: "delete",
      //   icon: "ri-delete-bin-line",
      //   permission: "credit.destroy",
      // },
    ],
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
  }

  ngOnInit() {
    this.years = this.generateYearOptions();
    this.paidCreditSales();
    this.paid_credit_sales$.pipe(takeUntil(this.destroy$)).subscribe((rcs) => {
      let paid_credit_sales = rcs?.data?.filter((element: any) => {
        element.credit_status =
          element.status == "0"
            ? `<div class="status-pending"><span>Requested</span></div>`
            : "-";
        return element;
      });
      this.tableConfig.data = rcs ? rcs?.data : [];
      this.tableConfig.total = rcs ? rcs?.total : 0;
    });
  }

  paidCreditSales() {
    this.store.dispatch(new PaidCreditSalesHistory({}));
  }

  generateYearOptions(
    startYear: number = new Date().getFullYear(),
    numberOfYears: number = 50
  ): any[] {
    return Array.from({ length: numberOfYears }, (_, i) => {
      const year = startYear + i;
      return {
        value: year,
        label: year.toString(),
      };
    });
  }

  onTableChange(data?: Params) {
    this.filter = { ...this.filter, ...data };
    this.store.dispatch(new PaidCreditSalesHistory(this.filter));
  }

  applyFilter(data: Select2UpdateEvent) {
    this.filter["product_type"] = data && data.value ? data.value : null;
    if (!this.filter["product_type"]) {
      delete this.filter["product_type"];
    }
    this.onTableChange(this.filter);
  }

  status(data: Product) {
    this.store.dispatch(new UpdateProductStatus(data.id, data.status));
  }

  download(data: Product) {
    if (data?.variations?.length) {
      this.DownloadModal.openModal(data);
    } else {
      this.store.dispatch(
        new Download({ product_id: data.id, variation_id: null })
      );
    }
  }

  export() {
    this.store
      .dispatch(new ExportCredits("paid_credit_sales"))
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          console.log("Export completed successfully:", res);
        },
        error: (err) => {
          console.error("Export failed:", err);
          this.notificationService.showError(
            err?.message || "Failed to export paid credit sales"
          );
        },
      });
  }

  openFilter() {
    this.open = !this.open;
  }

  selectItem(data: number[]) {
    this.renderer.addClass(this.document.body, "loader-none");
    if (Array.isArray(data) && data.length) {
      this.filter["category_ids"] = data.join();
    } else {
      this.filter["category_ids"] = [];
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
}
