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
import { CurrencySymbolPipe } from "../../../shared/pipe/currency-symbol.pipe";
import {
  GetPendingWithdraw,
  GetWithdrawRequest,
} from "src/app/shared/store/action/withdrawal.action";
import { CountryState } from "src/app/shared/store/state/country.state";
import { appConfig } from "src/app/core/config/config";
import { NotificationService } from "src/app/shared/services/notification.service";
import { WithdrawalState } from "src/app/shared/store/state/withdrawal.state";

@Component({
  selector: "app-pending-withdrawals",
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
  templateUrl: "./pending-withdrawals.component.html",
  styleUrl: "./pending-withdrawals.component.scss",
})
export class PendingWithdrawalsComponent {
  private destroy$ = new Subject<void>();
  private countryMap: Map<number, string> = new Map();

  pending_withrawal$: Observable<any> = inject(Store).select(
    WithdrawalState.pending_withdrawal
  ) as Observable<any>;
  countries$: Observable<any> = inject(Store).select(
    CountryState.countries
  ) as Observable<any>;
  statistics$: Observable<any | null> = inject(Store).select(
    WithdrawalState.statistics
  ) as Observable<any>;
  isLoading$: Observable<any> = inject(Store).select(
    WithdrawalState.isLoading
  ) as Observable<any>;

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
      { title: "date", dataField: "date", type: "date" },
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
      { title: "From Account", dataField: "withdraw_from" },
      { title: "Narration", dataField: "narration" },
      {
        title: "status",
        dataField: "status",
        sortable: true,
        sort_direction: "desc",
      },
    ],
    rowActions: [
      { label: "View", actionToPerform: "view", icon: "ri-printer-line" },
      {
        label: "Edit",
        actionToPerform: "edit",
        icon: "ri-pencil-line",
        permission: "withdrawal.edit",
      },
      {
        label: "Delete",
        actionToPerform: "delete",
        icon: "ri-delete-bin-line",
        permission: "withdrawal.destroy",
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
  }

  ngOnInit() {
    this.years = this.generateYearOptions();
    this.getPendingWithdrawals();
    this.countries$.pipe(takeUntil(this.destroy$)).subscribe((countries) => {
      if (countries && countries.length > 0) {
        this.countryMap = new Map(
          countries.map((country: any) => [country.value, country.label])
        );
        this.updateWithdrawalWithStatusLabels();
      }
    });
  }

  private getStatusLabel(statusValue: number): string {
    const status = appConfig.WITHDRAWAL_STATUS.find(
      (m) => m.value === statusValue
    );
    return status ? status.label : "";
  }

  private updateWithdrawalWithStatusLabels() {
    this.pending_withrawal$
      .pipe(takeUntil(this.destroy$))
      .subscribe((pending_withdrawal) => {
        if (!pending_withdrawal) return;

        const pending_withdrawals = pending_withdrawal.data?.map(
          (item: any) => ({
            ...item,
            withdraw_from: item.withdraw_from == 1 ? "Wallet" : "Savings",
            status: this.getStatusLabel(item.status),
          })
        );

        this.tableConfig.data = pending_withdrawals || [];
        this.tableConfig.total = pending_withdrawals.total || 0;
      });
  }

  getPendingWithdrawals() {
    this.store.dispatch(new GetPendingWithdraw({}));
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
    this.store.dispatch(new GetWithdrawRequest(this.filter));
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

  edit(data: any) {
    this.router.navigateByUrl(`/withdrawal/edit-withdrawal/${data.id}`);
  }

  view(data: any) {
    this.router.navigateByUrl(`/withdrawal/details/${data.id}`);
  }

  approve(data: Product) {
    this.store.dispatch(new ApproveProductStatus(data.id, data.is_approved));
  }

  status(data: Product) {
    this.store.dispatch(new UpdateProductStatus(data.id, data.status));
  }

  delete(data: Product) {
    // this.store.dispatch(new DeleteThrifts(data.id)).pipe(
    //   takeUntil(this.destroy$),
    // ).subscribe(
    //   {
    //     next: (res: any) => {
    //       const response = res?.thrifts?.response;
    //       if (response.status === appConfig.statusCode.ok) {
    //         this.notificationService.showSuccess(response.message);
    //         this.getThrifts();
    //       }
    //     },
    //     error: (err) => {
    //       this.notificationService.showError(err?.message || 'Failed to delete user!');
    //     }
    //   }
    // )
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

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.renderer.removeClass(this.document.body, "loader-none");
  }
}
