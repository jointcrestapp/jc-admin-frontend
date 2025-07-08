import {
  Component,
  Inject,
  PLATFORM_ID,
  Renderer2,
  ViewChild,
} from "@angular/core";
import { Store } from "@ngxs/store";
import { SettingState } from "../../../../../shared/store/state/setting.state";
import { Observable, Subject, takeUntil } from "rxjs";
import { Values } from "../../../../../shared/interface/setting.interface";
import { Select2Module } from "ng-select2-component";
import { ImportCsvModalComponent } from "../../../../../shared/components/ui/modal/import-csv-modal/import-csv-modal.component";
import { DigitalDownloadModalComponent } from "../../../../../shared/components/ui/modal/digital-download-modal/digital-download-modal.component";
import { Params, Router, RouterModule } from "@angular/router";
import {
  TableClickedAction,
  TableConfig,
} from "../../../../../shared/interface/table.interface";
import { CommonModule, DOCUMENT, isPlatformBrowser } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { PageWrapperComponent } from "../../../../../shared/components/page-wrapper/page-wrapper.component";
import { TableComponent } from "../../../../../shared/components/ui/table/table.component";
import { ConfigurationsState } from "src/app/shared/store/state/configurations.state";
import {
  GetSubscriptionFees,
  DeleteSubscriptionFee,
} from "src/app/shared/store/action/configurations.action";
import { appConfig } from "src/app/core/config/config";
import { NotificationService } from "src/app/shared/services/notification.service";

@Component({
  selector: "app-all-subscription-fee",
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule,
    Select2Module,
    PageWrapperComponent,
    TableComponent,
    ImportCsvModalComponent,
    DigitalDownloadModalComponent,
  ],
  templateUrl: "./all-subscription-fee.component.html",
  styleUrl: "./all-subscription-fee.component.scss",
})
export class AllSubscriptionFeeComponent {
  private destroy$ = new Subject<void>();

  public subsscriptions$: Observable<any>;
  public isLoading$: Observable<any>;
  public setting$: Observable<Values>;

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
      { title: "Date", dataField: "createdAt", type: "date" },
      { title: "currency", dataField: "currency" },
      {
        title: "amount",
        dataField: "subscription_fee",
        type: "price",
      },
    ],
    rowActions: [
      {
        label: "Edit",
        actionToPerform: "edit",
        icon: "ri-pencil-line",
        permission: "configurations.edit",
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

    // Initialize observables in constructor
    this.subsscriptions$ = this.store.select(ConfigurationsState.subscriptions);
    this.isLoading$ = this.store.select(ConfigurationsState.isLoading);
    this.setting$ = this.store.select(SettingState.setting);

    this.setting$.subscribe((setting) => {
      if (setting && setting.general) {
        this.url = setting.general.site_url;
      }
    });
  }

  ngOnInit() {
    this.getCurrencies();
    this.subsscriptions$
      .pipe(takeUntil(this.destroy$))
      .subscribe((subscription) => {
        let subscriptions = subscription?.data?.filter((element: any) => {
          //Comeback and fix country name rather than code
          return element;
        });
        this.tableConfig.data = subscription ? subscriptions : [];
        this.tableConfig.total = subscription ? subscription?.total : 0;
      });
  }

  getCurrencies() {
    this.store.dispatch(new GetSubscriptionFees({}));
  }

  onTableChange(data?: Params) {
    this.filter = { ...this.filter, ...data };
    this.store.dispatch(new GetSubscriptionFees(this.filter));
  }

  onActionClicked(action: TableClickedAction) {
    if (action.actionToPerform == "edit") this.edit(action.data);
    else if (action.actionToPerform == "delete") this.delete(action.data);
  }

  edit(data: any) {
    this.router.navigateByUrl(
      `/configurations/subscription-fee/edit-subscription-fee/${data.id}`
    );
  }

  delete(data: any) {
    this.store
      .dispatch(new DeleteSubscriptionFee(data.id))
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          const response = res?.configurations?.response;
          if (response.status === appConfig.statusCode.ok) {
            this.notificationService.showSuccess(response.message);
            this.getCurrencies();
          }
        },
        error: (err) => {
          this.notificationService.showError(
            err?.message || "Failed to delete user!"
          );
        },
      });
  }
}
