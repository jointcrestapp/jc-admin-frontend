import {
  Component,
  inject,
  Inject,
  OnDestroy,
  PLATFORM_ID,
  Renderer2,
  ViewChild,
} from "@angular/core";
import { Select, Store } from "@ngxs/store";
import { ProductState } from "../../../shared/store/state/product.state";
import { SettingState } from "../../../shared/store/state/setting.state";
import { CategoryState } from "../../../shared/store/state/category.state";
import { BrandState } from "../../../shared/store/state/brand.state";
import { StoreState } from "../../../shared/store/state/store.state";
import { AccountState } from "../../../shared/store/state/account.state";
import { finalize, Observable, Subject, takeUntil } from "rxjs";
import {
  Product,
  ProductModel,
} from "../../../shared/interface/product.interface";
import { Values } from "../../../shared/interface/setting.interface";
import { CategoryModel } from "../../../shared/interface/category.interface";
import {
  Select2Data,
  Select2Module,
  Select2Option,
  Select2UpdateEvent,
} from "ng-select2-component";
import { AccountUser } from "../../../shared/interface/account.interface";
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
import { ThriftsState } from "src/app/shared/store/state/thrift.state";
import {
  GetThrifts,
  DeleteThrifts,
  GetThriftsTiers,
  ExportThrifts,
} from "src/app/shared/store/action/thrift.action";
import { CountryState } from "src/app/shared/store/state/country.state";
import { appConfig } from "src/app/core/config/config";
import { NotificationService } from "src/app/shared/services/notification.service";

@Component({
  selector: "app-all-thrift",
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
  templateUrl: "./all-thrift.component.html",
  styleUrl: "./all-thrift.component.scss",
  standalone:true
})
export class AllThriftComponent {
  private destroy$ = new Subject<void>();
  private countryMap: Map<number, string> = new Map();
  product$: Observable<ProductModel> = inject(Store).select(
    ProductState.product
  );
  thrifts$: Observable<any> = inject(Store).select(
    ThriftsState.thrifts
  ) as Observable<any>;
  countries$: Observable<any> = inject(Store).select(
    CountryState.countries
  ) as Observable<any>;
  statistics$: Observable<any | null> = inject(Store).select(
    ThriftsState.statistics
  ) as Observable<any>;
  isLoading$: Observable<any> = inject(Store).select(
    ThriftsState.isLoading
  ) as Observable<any>;
  tiers$: Observable<any> = inject(Store).select(ThriftsState.tiers);
  categories$: Observable<any> = inject(Store).select(
    ThriftsState.categories
  ) as Observable<any>;
  setting$: Observable<Values> = inject(Store).select(
    SettingState.setting
  ) as Observable<Values>;
  category$: Observable<CategoryModel> = inject(Store).select(
    CategoryState.category
  ) as Observable<CategoryModel>;
  brand$: Observable<Select2Data> = inject(Store).select(BrandState.brands);
  store$: Observable<Select2Data> = inject(Store).select(StoreState.stores);
  user$: Observable<AccountUser> = inject(Store).select(AccountState.user);

  @ViewChild("csvModal") CSVModal: ImportCsvModalComponent;
  @ViewChild("downloadModal") DownloadModal: DigitalDownloadModalComponent;
  public years: Select2Data;

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

  public mainProductType: Select2Data = [
    {
      value: "physical",
      label: "Physical Product",
    },
    {
      value: "digital",
      label: "Digital Product",
    },
    {
      value: "external",
      label: "External/Affiliate product",
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
      { title: "Date Joined", dataField: "date", type: "date" },
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
      { title: "Thrift Tier", dataField: "tier_type" },
      { title: "Thrift Category", dataField: "tier_category" },
      {
        title: "Duration",
        dataField: "duration",
        sortable: true,
        sort_direction: "desc",
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
     // { title: "country", dataField: "user_country" },
    ],
    rowActions: [
     /* {
        label: "View", actionToPerform: "view", icon: "ri-printer-line",
        permission: "thrift.edit",
       },
       {
        label: "Edit",
        actionToPerform: "edit",
        icon: "ri-pencil-line",
        permission: "thrift.edit",
      }, */
      {
        label: "Delete",
        actionToPerform: "delete",
        icon: "ri-delete-bin-line",
        permission: "thrift.destroy",
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
    this.setting$.subscribe((setting) => {
      if (setting && setting.general) {
        this.url = setting.general.site_url;
      }
    });
  }

  ngOnInit() {
    this.getThrifts();
    this.getThriftsTiers();
    this.years = this.generateYearOptions();
    // this.store.dispatch(new GetThriftsCategories({}))
    this.countries$.pipe(takeUntil(this.destroy$)).subscribe((countries) => {
      if (countries && countries.length > 0) {
        this.countryMap = new Map(
          countries.map((country: any) => [country.value, country.label])
        );
        // console.log("Country Map:", this.countryMap); // Verify the map is correct
        this.updateThriftsWithCountryLabels();
      }
    });
  }

  private getMonthLabel(monthValue: number): string {
    const month = this.months.find((m) => m.value === monthValue);
    return month ? month.label : "";
  }

  private updateThriftsWithCountryLabels() {
    this.thrifts$.pipe(takeUntil(this.destroy$)).subscribe((thrift) => {
      if (!thrift) return;

      const thrifts = thrift.data?.map((item: any) => {
        // Replace country ID with label if available
        if (item.user_country && this.countryMap.has(item.user_country)) {
          return {
            ...item,
            month: this.getMonthLabel(item.month),
            user_country: this.countryMap.get(item.user_country),
          };
        }
        return item;
      });

      this.tableConfig.data = thrifts || [];
      this.tableConfig.total = thrift.total || 0;
    });
  }

  getThrifts() {
    this.store.dispatch(new GetThrifts({}));
  }

  getThriftsTiers() {
    this.store.dispatch(new GetThriftsTiers({}));
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
    this.store.dispatch(new GetThrifts(this.filter));
  }

  applyFilter(data: Select2UpdateEvent) {
    this.filter["tier_type"] = data && data.value ? data.value : null;
    if (!this.filter["tier_type"]) {
      delete this.filter["tier_type"];
    }
    this.onTableChange(this.filter);
  }

  onActionClicked(action: TableClickedAction) {
    if (action.actionToPerform == "edit") this.edit(action.data);
    else if (action.actionToPerform == "is_approved") this.approve(action.data);
    else if (action.actionToPerform == "status") this.status(action.data);
    else if (action.actionToPerform == "delete") this.delete(action.data);
    else if (action.actionToPerform == "deleteAll") this.deleteAll(action.data);
    else if (action.actionToPerform == "duplicate") this.duplicate(action.data);
    else if (action.actionToPerform == "download") this.download(action.data);
    else if (action.actionToPerform == "view") this.view(action.data);
  }

  edit(data: Product) {
    this.router.navigateByUrl(`/thrift/edit-thrift/${data.id}`);
  }

  view(data: Product) {
    this.router.navigateByUrl(`/thrift/details/${data.id}`);
  }

  approve(data: Product) {
    this.store.dispatch(new ApproveProductStatus(data.id, data.is_approved));
  }

  status(data: Product) {
    this.store.dispatch(new UpdateProductStatus(data.id, data.status));
  }

  delete(data: Product) {
    this.store
      .dispatch(new DeleteThrifts(data.id))
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          const response = res?.thrifts?.response;
          if (response.status === appConfig.statusCode.ok) {
            this.notificationService.showSuccess(response.message);
            this.getThrifts();
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
    this.store
      .dispatch(new ExportThrifts(this.tableConfig.data))
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          console.log("Export completed successfully:", res);
        },
        error: (err) => {
          console.error("Export failed:", err);
          this.notificationService.showError(
            err?.message || "Failed to export thrifts"
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
