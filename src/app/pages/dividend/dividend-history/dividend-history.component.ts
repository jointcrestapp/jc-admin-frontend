import {
  Component,
  inject,
  Inject,
  OnDestroy,
  PLATFORM_ID,
  Renderer2,
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
  Download,
  ExportProduct,
  ReplicateProduct,
  UpdateProductStatus,
} from "../../../shared/store/action/product.action";
import { TranslateModule } from "@ngx-translate/core";
import { PageWrapperComponent } from "../../../shared/components/page-wrapper/page-wrapper.component";
import { TableComponent } from "../../../shared/components/ui/table/table.component";
import { HasPermissionDirective } from "../../../shared/directive/has-permission.directive";
import { DividendState } from "src/app/shared/store/state/dividend.state";
import {
  SetLoadingState,
  GetDividends,
  GetFilteredMembers,
  ExportDividends,
} from "src/app/shared/store/action/dividend.action";
import { CountryState } from "src/app/shared/store/state/country.state";
import { appConfig } from "src/app/core/config/config";
import { NotificationService } from "src/app/shared/services/notification.service";

@Component({
  selector: "app-dividend-history",
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
  templateUrl: "./dividend-history.component.html",
  styleUrl: "./dividend-history.component.scss",
  standalone:true
})
export class DividendHistoryComponent {
  private destroy$ = new Subject<void>();
  dividends$: Observable<any> = inject(Store).select(
    DividendState.dividend
  ) as Observable<any>;
  countries$: Observable<any> = inject(Store).select(
    CountryState.countries
  ) as Observable<any>;
  isLoading$: Observable<any> = inject(Store).select(
    DividendState.isLoading
  ) as Observable<any>;
  setting$: Observable<Values> = inject(Store).select(
    SettingState.setting
  ) as Observable<Values>;

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
      { title: "Savings Balance", dataField: "savings_bal", type: "price" },
      {
        title: "Savings Dividend",
        dataField: "savings_dividend",
        type: "price",
      },
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
    this.years = this.generateYearOptions();
    this.getDividends();
    this.dividends$.pipe(takeUntil(this.destroy$)).subscribe((dividend) => {
      let dividends = dividend?.data?.filter((element: any) => {
        return element;
      });
      this.tableConfig.data = dividend ? dividends : [];
      this.tableConfig.total = dividend ? dividend?.total : 0;
    });
  }

  getDividends() {
    this.store.dispatch(new GetDividends({}));
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
    this.store.dispatch(new GetDividends(this.filter));
  }

  applyFilter(data: Select2UpdateEvent) {
    this.filter["savings_type"] = data && data.value ? data.value : null;
    if (!this.filter["savings_type"]) {
      delete this.filter["savings_type"];
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
    this.router.navigateByUrl(`/savings/edit-savings/${data.id}`);
  }

  view(data: Product) {
    this.router.navigateByUrl(`/savings/details/${data.id}`);
  }

  approve(data: Product) {
    this.store.dispatch(new ApproveProductStatus(data.id, data.is_approved));
  }

  status(data: Product) {
    this.store.dispatch(new UpdateProductStatus(data.id, data.status));
  }

  delete(data: Product) {
    // this.store
    //   .dispatch(new DeleteSaving(data.id))
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe({
    //     next: (res: any) => {
    //       const response = res?.savings?.response;
    //       if (response.status === appConfig.statusCode.ok) {
    //         this.notificationService.showSuccess(response.message);
    //         this.getSavings();
    //       }
    //     },
    //     error: (err) => {
    //       this.notificationService.showError(
    //         err?.message || "Failed to delete user!"
    //       );
    //     },
    //   });
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
      .dispatch(new ExportDividends())
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          console.log("Export completed successfully:", res);
        },
        error: (err) => {
          console.error("Export failed:", err);
          this.notificationService.showError(
            err?.message || "Failed to export dividend history"
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
