import {
  Component,
  inject,
  Inject,
  OnDestroy,
  PLATFORM_ID,
} from "@angular/core";
import { Store } from "@ngxs/store";
import { Observable, Subject, takeUntil } from "rxjs";
import { Select2Data, Select2Module } from "ng-select2-component";
import { Params, RouterModule } from "@angular/router";
import {
  TableClickedAction,
  TableConfig,
} from "../../../shared/interface/table.interface";
import { CommonModule, isPlatformBrowser } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { PageWrapperComponent } from "../../../shared/components/page-wrapper/page-wrapper.component";
import { TableComponent } from "../../../shared/components/ui/table/table.component";
import { HasPermissionDirective } from "../../../shared/directive/has-permission.directive";
import { DividendState } from "src/app/shared/store/state/dividend.state";
import { GetDividends, ExportDividends } from "src/app/shared/store/action/dividend.action";
import { NotificationService } from "src/app/shared/services/notification.service";

@Component({
  selector: "app-dividend-history",
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule,
    HasPermissionDirective,
    Select2Module,
    PageWrapperComponent,
    TableComponent,
  ],
  templateUrl: "./dividend-history.component.html",
  styleUrl: "./dividend-history.component.scss",
})
export class DividendHistoryComponent {
  private destroy$ = new Subject<void>();
  dividends$: Observable<any> = inject(Store).select(
    DividendState.dividend
  ) as Observable<any>;
  isLoading$: Observable<any> = inject(Store).select(
    DividendState.isLoading
  ) as Observable<any>;
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
      { title: "Year", dataField: "year" },
      { title: "Equity (₦)", dataField: "member_equity", type: "price" },
      { title: "Share %", dataField: "savings_percent" },
      { title: "Dividend Pool (₦)", dataField: "total_declared", type: "price" },
      { title: "Dividend Earned (₦)", dataField: "dividend_amount", type: "price" },
      { title: "Rate", dataField: "dividend_percent" },
    ],
    rowActions: [],
    data: [] as any[],
    total: 0,
  };

  constructor(
    private store: Store,
    @Inject(PLATFORM_ID) private platformId: object,
    private notificationService: NotificationService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
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

  onActionClicked(action: TableClickedAction) {
    // reserved for future row actions
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

  filters(data: any, key: string) {
    const val = data?.value ?? data ?? '';
    if (val !== '' && val !== null && val !== undefined) {
      this.filter[key] = val;
    } else {
      delete this.filter[key];
    }
    this.onTableChange(this.filter);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
