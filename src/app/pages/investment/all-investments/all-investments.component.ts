import {
  Component,
  Inject,
  PLATFORM_ID,
  Renderer2,
  ViewChild,
} from "@angular/core";
import { Store } from "@ngxs/store";
import { SettingState } from "../../../shared/store/state/setting.state";
import { Observable, Subject, takeUntil } from "rxjs";
import { Values } from "../../../shared/interface/setting.interface";
import { Select2Data, Select2Module } from "ng-select2-component";
import { ImportCsvModalComponent } from "../../../shared/components/ui/modal/import-csv-modal/import-csv-modal.component";
import { DigitalDownloadModalComponent } from "../../../shared/components/ui/modal/digital-download-modal/digital-download-modal.component";
import { Params, Router, RouterModule } from "@angular/router";
import {
  TableClickedAction,
  TableConfig,
} from "../../../shared/interface/table.interface";
import { CommonModule, DOCUMENT, isPlatformBrowser } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { PageWrapperComponent } from "../../../shared/components/page-wrapper/page-wrapper.component";
import { TableComponent } from "../../../shared/components/ui/table/table.component";
import { InvestmentsState } from "src/app/shared/store/state/investment.state";
import {
  GetInvestments,
  DeleteInvestment,
  DisburseInvestment,
} from "src/app/shared/store/action/investment.action";
import { appConfig } from "src/app/core/config/config";
import { NotificationService } from "src/app/shared/services/notification.service";
import { HasPermissionDirective } from "src/app/shared/directive/has-permission.directive";
import { CountryState } from "src/app/shared/store/state/country.state";

@Component({
  selector: "app-all-investments",
  imports: [
    CommonModule,
    TranslateModule,
    HasPermissionDirective,
    RouterModule,
    Select2Module,
    PageWrapperComponent,
    TableComponent,
    ImportCsvModalComponent,
    DigitalDownloadModalComponent,
  ],
  templateUrl: "./all-investments.component.html",
  styleUrl: "./all-investments.component.scss",
  standalone: true
})
export class AllInvestmentsComponent {
  private destroy$ = new Subject<void>();

  public countries$: Observable<any>;
  public investments$: Observable<any>;
  public isLoading$: Observable<any>;
  public setting$: Observable<Values>;

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
      { title: "Name", dataField: "name" },
      { title: "Total Fund", dataField: "total_investment_fund", type: "price" },
      { title: "Contributed", dataField: "total_contributed", type: "price" },
      { title: "Investors", dataField: "contributor_count" },
      { title: "Rate", dataField: "rate" },
      { title: "Tenure", dataField: "tenure" },
      { title: "End Date", dataField: "end_date", type: "date", date_format: "dd MMM, yyyy" },
      { title: "Status", dataField: "maturity_status" },
    ],
    rowActions: [
      {
        label: "Edit",
        actionToPerform: "edit",
        icon: "ri-pencil-line",
        conditional: { field: 'total_contributed', condition: '==', value: '0' },
      },
      {
        label: "Delete",
        actionToPerform: "delete",
        icon: "ri-delete-bin-line",
        conditional: { field: 'total_contributed', condition: '==', value: '0' },
      },
      {
        label: "Disburse",
        actionToPerform: "disburse",
        icon: "ri-send-plane-fill",
        conditional: { field: 'can_disburse', condition: '==', value: 'true' },
      },
    ],
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

    this.investments$ = this.store.select(InvestmentsState.investments);
    this.isLoading$ = this.store.select(InvestmentsState.isLoading);
    this.setting$ = this.store.select(SettingState.setting);
    this.countries$ = this.store.select(
      CountryState.countries
    ) as Observable<any>;

    this.setting$.subscribe((setting) => {
      if (setting && setting.general) {
        this.url = setting.general.site_url;
      }
    });
  }

  ngOnInit() {
    this.years = this.generateYearOptions();
    this.getInvestments();
    this.investments$.pipe(takeUntil(this.destroy$)).subscribe((investment) => {
      const now = new Date();
      const investments = (investment?.data ?? []).map((inv: any) => ({
        ...inv,
        maturity_status: inv.is_disbursed
          ? '<span class="badge bg-success">Disbursed</span>'
          : inv.is_matured
            ? '<span class="badge bg-warning text-dark">Matured</span>'
            : '<span class="badge bg-primary">Active</span>',
        can_disburse: String(inv.is_matured && !inv.is_disbursed),
      }));
      this.tableConfig.data = investments;
      this.tableConfig.total = investment?.total ?? 0;
    });
  }

  getInvestments() {
    this.store.dispatch(new GetInvestments({}));
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
    this.store.dispatch(new GetInvestments(this.filter));
  }

  onActionClicked(action: TableClickedAction) {
    if (action.actionToPerform == "edit") this.edit(action.data);
    else if (action.actionToPerform == "delete") this.delete(action.data);
    else if (action.actionToPerform == "disburse") this.disburse(action.data);
  }

  edit(data: any) {
    this.router.navigateByUrl(`/investment/edit-investments/${data.id}`);
  }

  delete(data: any) {
    this.store
      .dispatch(new DeleteInvestment(data.id))
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          const response = res?.investments?.response;
          if (response.status === appConfig.statusCode.ok) {
            this.notificationService.showSuccess(response.message);
            this.getInvestments();
          }
        },
        error: (err) => {
          this.notificationService.showError(err?.message || "Failed to delete investment!");
        },
      });
  }

  disburse(data: any) {
    const confirmed = window.confirm(
      `Disburse "${data.name}" to ${data.contributor_count} investor(s)?\n\nPrincipal + ${data.rate}% ROI will be credited to each member's wallet. This cannot be undone.`
    );
    if (!confirmed) return;

    this.store
      .dispatch(new DisburseInvestment(data.id))
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          const response = res?.investments?.response;
          this.notificationService.showSuccess(response?.message || "Disbursement successful!");
        },
        error: (err) => {
          this.notificationService.showError(err?.message || "Disbursement failed!");
        },
      });
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
