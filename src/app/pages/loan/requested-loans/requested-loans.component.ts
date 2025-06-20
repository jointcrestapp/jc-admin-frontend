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
  ApproveProductStatus,
  DeleteAllProduct,
  DeleteProduct,
  Download,
  ExportProduct,
  GetProducts,
  ReplicateProduct,
  UpdateProductStatus,
} from "../../../shared/store/action/product.action";
import { TranslateModule } from "@ngx-translate/core";
import { PageWrapperComponent } from "../../../shared/components/page-wrapper/page-wrapper.component";
import { TableComponent } from "../../../shared/components/ui/table/table.component";
import { HasPermissionDirective } from "../../../shared/directive/has-permission.directive";
import { CurrencySymbolPipe } from "../../../shared/pipe/currency-symbol.pipe";
import {
  GetLoan,
  DeleteLoan,
  ApproveLoanStatus,
} from "src/app/shared/store/action/loan.action";
import { CountryState } from "src/app/shared/store/state/country.state";
import { appConfig } from "src/app/core/config/config";
import { NotificationService } from "src/app/shared/services/notification.service";
import { LoanState } from "src/app/shared/store/state/loan.state";

@Component({
  selector: "app-requested-loans",
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
  templateUrl: "./requested-loans.component.html",
  styleUrl: "./requested-loans.component.scss",
})
export class RequestedLoansComponent {
  private destroy$ = new Subject<void>();

  loans$: Observable<any> = inject(Store).select(
    LoanState.request_loans
  ) as Observable<any>;
  countries$: Observable<any> = inject(Store).select(
    CountryState.countries
  ) as Observable<any>;
  statistics$: Observable<any | null> = inject(Store).select(
    LoanState.statistics
  ) as Observable<any>;
  isLoading$: Observable<any> = inject(Store).select(
    LoanState.isLoading
  ) as Observable<any>;

  @ViewChild("csvModal") CSVModal: ImportCsvModalComponent;
  @ViewChild("downloadModal") DownloadModal: DigitalDownloadModalComponent;
  public years: Select2Data;

  public loanType: Select2Data = [
    {
      value: "savings",
      label: "Savings",
    },
    {
      value: "withdrawal",
      label: "Withdrawal",
    },
  ];

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
        dataField: "amount",
        type: "price",
        sortable: true,
        sort_direction: "desc",
      },
      { title: "Total Due", dataField: "total_due" },
      { title: "Interest", dataField: "interest" },
      {
        title: "Monthly Due",
        dataField: "monthly_due",
        sortable: true,
        sort_direction: "desc",
      },
      {
        title: "Status",
        dataField: "status",
      },
      {
        title: "Loan Type",
        dataField: "loan_type",
        sortable: true,
        sort_direction: "desc",
      },
    ],
    rowActions: [
      { label: "View", actionToPerform: "view", icon: "ri-printer-line" },
      {
        label: "Transition",
        actionToPerform: "reactivate",
        icon: "ri-check-line",
        permission: "loan.edit",
      },
      {
        label: "Edit",
        actionToPerform: "edit",
        icon: "ri-pencil-line",
        permission: "loan.edit",
      },
      {
        label: "Delete",
        actionToPerform: "delete",
        icon: "ri-delete-bin-line",
        permission: "loan.edit",
      },
    ],
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
  }

  ngOnInit() {
    this.years = this.generateYearOptions();
    this.getLoan();
    this.loans$.pipe(takeUntil(this.destroy$)).subscribe((loan) => {
      let loans = loan?.data?.filter((element: any) => {
        //Comeback and fix country name rather than code
        element.status =
          element.status == "0"
            ? `<div class="status-pending"><span>Requested</span></div>`
            : "-";
        return element;
      });
      this.tableConfig.data = loan ? loans : [];
      this.tableConfig.total = loan ? loan?.total : 0;
    });
  }

  getLoan() {
    this.store.dispatch(new GetLoan({}));
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
    this.store.dispatch(new GetLoan(this.filter));
  }

  applyFilter(data: Select2UpdateEvent) {
    this.filter["loan_type"] = data && data.value ? data.value : null;
    if (!this.filter["loan_type"]) {
      delete this.filter["loan_type"];
    }
    this.onTableChange(this.filter);
  }

  onActionClicked(action: TableClickedAction) {
    if (action.actionToPerform == "edit") this.edit(action.data);
    else if (action.actionToPerform == "reactivate") this.approve(action.data);
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
    this.router.navigate(["loan/details", data.id], {
      queryParams: { loan_type: "request" }, // Add query params
    });
    // this.router.navigateByUrl(`/loan/details/${data.id}`);
  }

  approve(data: any) {
    this.store
      .dispatch(new ApproveLoanStatus({ status: 1 }, data.id))
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          const response = res?.loan?.response;
          if (response.status === appConfig.statusCode.ok) {
            this.notificationService.showSuccess(response.message);
            this.getLoan();
          }
        },
        error: (err) => {
          this.notificationService.showError(
            err?.message || "Failed to delete user!"
          );
        },
      });
  }

  status(data: Product) {
    this.store.dispatch(new UpdateProductStatus(data.id, data.status));
  }

  delete(data: Product) {
    this.store
      .dispatch(new DeleteLoan(data.id))
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          console.log("Resp :::::::", res);
          const response = res?.loan?.response;
          if (response.status === appConfig.statusCode.ok) {
            this.notificationService.showSuccess(response.message);
            this.getLoan();
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
