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
  ExportProduct,
  ReplicateProduct,
  UpdateProductStatus,
} from "../../../shared/store/action/product.action";
import { TranslateModule } from "@ngx-translate/core";
import { PageWrapperComponent } from "../../../shared/components/page-wrapper/page-wrapper.component";
import { TableComponent } from "../../../shared/components/ui/table/table.component";
import { HasPermissionDirective } from "../../../shared/directive/has-permission.directive";
import { CurrencySymbolPipe } from "../../../shared/pipe/currency-symbol.pipe";
import {
  ApproveCreditSalesStatus,
  ApprovedCreditSales,
  DeleteCreditSales,
  DispatchCreditSalesStatus,
} from "src/app/shared/store/action/credit.action";
import { CountryState } from "src/app/shared/store/state/country.state";
import { ConfigurationsState } from "src/app/shared/store/state/configurations.state";
import { appConfig } from "src/app/core/config/config";
import { NotificationService } from "src/app/shared/services/notification.service";
import { CreditState } from "src/app/shared/store/state/credit.state";
import { GetProductPlans } from "src/app/shared/store/action/configurations.action";

@Component({
  selector: "app-approved-credit-sales",
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
    CurrencySymbolPipe,
  ],
  templateUrl: "./approved-credit-sales.component.html",
  styleUrl: "./approved-credit-sales.component.scss",
})
export class ApprovedCreditSalesComponent {
  private destroy$ = new Subject<void>();

  approved_credit_sales$: Observable<any> = inject(Store).select(
    CreditState.approved_credit_sales
  ) as Observable<any>;
  product_types$: Observable<any> = inject(Store).select(
    ConfigurationsState.product_plans
  ) as Observable<any>;
  countries$: Observable<any> = inject(Store).select(
    CountryState.countries
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
      { title: "Date", dataField: "date", type: "date" },
      { title: "Member ID", dataField: "member_id" },
      {
        title: "Full Name",
        dataField: "full_name",
        sortable: true,
        sort_direction: "desc",
      },
      {
        title: "Principal",
        dataField: "principal",
        type: "price",
        sortable: true,
        sort_direction: "desc",
      },
      { title: "Total Due", dataField: "total_due", type: "price" },
      { title: "Interest", dataField: "interest", type: "price" },
      {
        title: "Monthly Due",
        dataField: "monthly_due",
        type: "price",
      },
      {
        title: "Status",
        dataField: "status",
        type: "transition",
      },
    ],
    rowActions: [
      {
        label: "View",
        actionToPerform: "view",
        icon: "ri-printer-line",
        permission: "credit.index",
      },
      {
        label: "Approved",
        actionToPerform: "reactivate",
        icon: "ri-check-line",
        permission: "credit.edit",
      },
      {
        label: "Delete",
        actionToPerform: "delete",
        icon: "ri-delete-bin-line",
        permission: "credit.edit",
      },
    ],
    data: [] as any[],
    total: 0,
  };
  product_plans: any[];

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
    this.approvedCreditSales();
    this.getProductPlan();

    this.product_types$.pipe(takeUntil(this.destroy$)).subscribe((pt) => {
      this.product_plans = pt?.data.filter((element: any) => {
        element.value = element.id;
        element.label = element.name;
        return element;
      });
    });
    this.approved_credit_sales$
      .pipe(takeUntil(this.destroy$))
      .subscribe((rcs) => {
        let approved_credit_sales = rcs?.data?.filter((element: any) => {
          element.status =
            element.status == "1"
              ? `<div class="status-approved"><span>Approved</span></div>`
              : "-";
          return element;
        });
        this.tableConfig.data = rcs ? rcs?.data : [];
        this.tableConfig.total = rcs ? rcs?.total : 0;
      });
  }

  approvedCreditSales() {
    this.store.dispatch(new ApprovedCreditSales({}));
  }

  getProductPlan() {
    this.store.dispatch(new GetProductPlans({}));
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
    this.store.dispatch(new ApprovedCreditSales(this.filter));
  }

  applyFilter(data: Select2UpdateEvent) {
    this.filter["product_type"] = data && data.value ? data.value : null;
    if (!this.filter["product_type"]) {
      delete this.filter["product_type"];
    }
    this.onTableChange(this.filter);
  }

  onActionClicked(action: TableClickedAction) {
    if (action.actionToPerform == "edit") this.edit(action.data);
    else if (action.actionToPerform == "reactivate") this.dispatch(action.data);
    else if (action.actionToPerform == "status") this.status(action.data);
    else if (action.actionToPerform == "delete") this.delete(action.data);
    else if (action.actionToPerform == "deleteAll") this.deleteAll(action.data);
    else if (action.actionToPerform == "duplicate") this.duplicate(action.data);
    else if (action.actionToPerform == "download") this.download(action.data);
    else if (action.actionToPerform == "view") this.view(action.data);
  }

  edit(data: any) {
    this.router.navigateByUrl(`/loan/edit-loan/${data.id}`);
  }

  view(data: Product) {
    this.router.navigateByUrl(`/loan/details/${data.id}`);
  }

  dispatch(data: any) {
    this.store
      .dispatch(new DispatchCreditSalesStatus({ status: 2 }, data.id))
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          const response = res?.credit?.response;
          if (response.status === appConfig.statusCode.ok) {
            this.notificationService.showSuccess(response.message);
            this.approvedCreditSales();
          }
        },
        error: (err) => {
          this.notificationService.showError(
            err?.message || "Failed to delete credit sales!"
          );
        },
      });
  }

  status(data: Product) {
    this.store.dispatch(new UpdateProductStatus(data.id, data.status));
  }

  delete(data: Product) {
    this.store
      .dispatch(new DeleteCreditSales(data.id))
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          const response = res?.credit?.response;
          if (response.status === appConfig.statusCode.ok) {
            this.notificationService.showSuccess(response.message);
            this.approvedCreditSales();
          }
        },
        error: (err) => {
          this.notificationService.showError(
            err?.message || "Failed to delete credit sales!"
          );
        },
      });
  }

  deleteAll(ids: number[]) {
    this.store.dispatch(new DeleteAllProduct(ids));
  }

  duplicate(ids: number[]) {
    this.store.dispatch(new ReplicateProduct(ids));
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
    this.store.dispatch(new ExportProduct(this.filter));
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
