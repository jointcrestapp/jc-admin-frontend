import {
  Component,
  inject,
  Inject,
  PLATFORM_ID,
  ViewChild,
} from "@angular/core";
import { Store } from "@ngxs/store";
import { SettingState } from "../../../shared/store/state/setting.state";
import { Observable, Subject, takeUntil } from "rxjs";
import { Product } from "../../../shared/interface/product.interface";
import { Values } from "../../../shared/interface/setting.interface";
import {
  Select2Data,
  Select2Module,
  Select2Option,
  Select2UpdateEvent,
} from "ng-select2-component";
import { ImportCsvModalComponent } from "../../../shared/components/ui/modal/import-csv-modal/import-csv-modal.component";
import { DigitalDownloadModalComponent } from "../../../shared/components/ui/modal/digital-download-modal/digital-download-modal.component";
import { Params, Router, RouterModule } from "@angular/router";
import {
  TableClickedAction,
  TableConfig,
} from "../../../shared/interface/table.interface";
import { CommonModule, isPlatformBrowser } from "@angular/common";
import {
  Download,
  ExportProduct,
  ReplicateProduct,
} from "../../../shared/store/action/product.action";
import { TranslateModule } from "@ngx-translate/core";
import { PageWrapperComponent } from "../../../shared/components/page-wrapper/page-wrapper.component";
import { TableComponent } from "../../../shared/components/ui/table/table.component";
import { HasPermissionDirective } from "../../../shared/directive/has-permission.directive";
import { CurrencySymbolPipe } from "../../../shared/pipe/currency-symbol.pipe";
import { WalletState } from "src/app/shared/store/state/wallet.state";
import {
  ExportTransactions,
  GetUserTransaction,
} from "src/app/shared/store/action/wallet.action";
import { CountryState } from "src/app/shared/store/state/country.state";
import { NotificationService } from "src/app/shared/services/notification.service";

@Component({
  selector: "app-all-wallet-transactions",
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
  templateUrl: "./all-wallet-transactions.component.html",
  styleUrl: "./all-wallet-transactions.component.scss",
})
export class AllWalletTransactionsComponent {
  private destroy$ = new Subject<void>();
  private countryMap: Map<number, string> = new Map();

  public subStatus: Select2Data = [
    {
      value: "0",
      label: "Debit",
    },
    {
      value: "1",
      label: "Credit",
    },
  ];

  transactions$: Observable<any> = inject(Store).select(
    WalletState.transactions
  ) as Observable<any>;
  countries$: Observable<any> = inject(Store).select(
    CountryState.countries
  ) as Observable<any>;
  statistics$: Observable<any | null> = inject(Store).select(
    WalletState.statistics
  ) as Observable<any>;
  isLoading$: Observable<any> = inject(Store).select(
    WalletState.isLoading
  ) as Observable<any>;
  setting$: Observable<Values> = inject(Store).select(
    SettingState.setting
  ) as Observable<Values>;

  @ViewChild("csvModal") CSVModal: ImportCsvModalComponent;
  @ViewChild("downloadModal") DownloadModal: DigitalDownloadModalComponent;

  public years: Select2Data;
  public months: Select2Option[] = [
    {
      value: 1,
      label: "January",
    },
    {
      value: 2,
      label: "February",
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
        title: "amount",
        dataField: "amount",
        type: "price",
        sortable: true,
        sort_direction: "desc",
      },
      { title: "Ref", dataField: "txn_ref" },
      {
        title: "transaction",
        dataField: "transactions",
      },
      {
        title: "month",
        dataField: "month",
        sortable: true,
        sort_direction: "desc",
      },
      {
        title: "year",
        dataField: "year",
        sortable: true,
        sort_direction: "desc",
      },
      { title: "status", dataField: "status" },
      /* { title: "country", dataField: "user_country" }, */
    ],
    rowActions: [
      { label: "View", actionToPerform: "view", icon: "ri-printer-line" },
    ],
    data: [] as Product[],
    total: 0,
  };

  constructor(
    private store: Store,
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
    this.years = this.generateYearOptions();
    this.getTransactions();
    this.countries$.pipe(takeUntil(this.destroy$)).subscribe((countries) => {
      if (countries && countries.length > 0) {
        this.countryMap = new Map(
          countries.map((country: any) => [country.value, country.label])
        );
        // console.log("Country Map:", this.countryMap); // Verify the map is correct
        this.updateTransactionsWithCountryLabels();
      }
    });
  }
  applyFilter(data: Select2UpdateEvent) {
    this.filter["status"] = data && data.value ? data.value : null;
    if (!this.filter["status"]) {
      delete this.filter["status"];
    }
    this.onTableChange(this.filter);
  }
  getTransactions() {
    this.store.dispatch(new GetUserTransaction({}));


    
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
  private getMonthLabel(monthValue: number): string {
    const month = this.months.find((m) => m.value === monthValue);
    return month ? month.label : "";
  }

  private updateTransactionsWithCountryLabels() {
    this.transactions$
      .pipe(takeUntil(this.destroy$))
      .subscribe((transaction) => {
        let transactions = transaction.data?.map((item: any) => {
          if (item.user_country && this.countryMap.has(item.user_country)) {
            return {
              ...item,
              month: this.getMonthLabel(item.month),
              user_country: this.countryMap.get(item.user_country)
            };
          }
          return item;
        });
        transactions.filter((element: any) => {
        element.status =
          element.status == 0
            ? `<div class="status-danger"><span>Debit</span></div>`
            : `<div class="status-success"><span>Credit</span></div>`;
        return element;
      });
        this.tableConfig.data = transactions || [];
        this.tableConfig.total = transactions.total || 0;
      });
  }

  onTableChange(data?: Params) {
    this.filter = { ...this.filter, ...data };
    this.store.dispatch(new GetUserTransaction(this.filter));
  }

  onActionClicked(action: TableClickedAction) {
    if (action.actionToPerform == "duplicate") this.duplicate(action.data);
    else if (action.actionToPerform == "download") this.download(action.data);
    else if (action.actionToPerform == "view") this.view(action.data);
  }

  view(data: Product) {
    this.router.navigateByUrl(`/wallet-transaction/details/${data.id}`);
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
    this.store
      .dispatch(new ExportTransactions())
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          console.log("Export completed successfully:", res);
        },
        error: (err) => {
          console.error("Export failed:", err);
          this.notificationService.showError(
            err?.message || "Failed to export transactions"
          );
        },
      });
  }

  openFilter() {
    this.open = !this.open;
  }

  filters(data: any, key: string) {
    const val = data?.value ?? data ?? '';
    if (val !== '' && val !== null && val !== undefined) {
      this.filter[key] = val;
    } else {
      delete this.filter[key];
    }
    this.onTableChange(this.filter);
  }
}
