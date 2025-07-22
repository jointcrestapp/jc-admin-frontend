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
import { Product } from "../../../../shared/interface/product.interface";
import { Select2Module } from "ng-select2-component";
import { ImportCsvModalComponent } from "../../../../shared/components/ui/modal/import-csv-modal/import-csv-modal.component";
import { DigitalDownloadModalComponent } from "../../../../shared/components/ui/modal/digital-download-modal/digital-download-modal.component";
import { Params, Router, RouterModule } from "@angular/router";
import {
  TableClickedAction,
  TableConfig,
} from "../../../../shared/interface/table.interface";
import { CommonModule, DOCUMENT, isPlatformBrowser } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { PageWrapperComponent } from "../../../../shared/components/page-wrapper/page-wrapper.component";
import { TableComponent } from "../../../../shared/components/ui/table/table.component";
import { HasPermissionDirective } from "../../../../shared/directive/has-permission.directive";
import { MiscellaneousState } from "src/app/shared/store/state/miscellaneous.state";
import {
  GetByeLaws,
  DeleteByeLaw,
} from "src/app/shared/store/action/miscellaneous.action";
import { appConfig } from "src/app/core/config/config";
import { NotificationService } from "src/app/shared/services/notification.service";

@Component({
  selector: "app-all-bye-laws",
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
  templateUrl: "./all-bye-laws.component.html",
  styleUrl: "./all-bye-laws.component.scss",
})
export class AllByeLawsComponent {
  private destroy$ = new Subject<void>();

  bye_laws$: Observable<any> = inject(Store).select(
    MiscellaneousState.byeLaw
  ) as Observable<any>;
  isLoading$: Observable<any> = inject(Store).select(
    MiscellaneousState.isLoading
  ) as Observable<any>;

  @ViewChild("csvModal") CSVModal: ImportCsvModalComponent;
  @ViewChild("downloadModal") DownloadModal: DigitalDownloadModalComponent;

  public filter: Params = {
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
      { title: "Updated On", dataField: "updated_at", type: "date" },
      {
        title: "Title",
        dataField: "title",
      },
      { title: "Status", dataField: "status" },
    ],
    rowActions: [
      { label: "View", actionToPerform: "view", icon: "ri-printer-line" },
      {
        label: "Edit",
        actionToPerform: "edit",
        icon: "ri-pencil-line",
        permission: "miscellaneous.edit",
      },
      {
        label: "Delete",
        actionToPerform: "delete",
        icon: "ri-delete-bin-line",
        permission: "miscellaneous.destroy",
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
    this.getByeLaws();
    this.updateSharesWithCountryLabels();
  }

  getByeLaws() {
    this.store.dispatch(new GetByeLaws({}));
  }

  private updateSharesWithCountryLabels() {
    this.bye_laws$.pipe(takeUntil(this.destroy$)).subscribe((bl) => {
      if (!bl) return;

      const bye_laws = bl.data?.map((item: any) => {
        return item;
      });

      this.tableConfig.data = bye_laws || [];
      this.tableConfig.total = bl.total || 0;
    });
  }

  onTableChange(data?: Params) {
    this.filter = { ...this.filter, ...data };
    this.store.dispatch(new GetByeLaws(this.filter));
  }

  onActionClicked(action: TableClickedAction) {
    if (action.actionToPerform == "edit") this.edit(action.data);
    else if (action.actionToPerform == "delete") this.delete(action.data);
  }

  edit(data: any) {
    this.router.navigateByUrl(`/miscellaneous/edit-bye-law/${data.id}`);
  }

  delete(data: Product) {
    this.store
      .dispatch(new DeleteByeLaw(data.id))
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          const response = res?.miscellaneous?.response;
          if (response.status === appConfig.statusCode.ok) {
            this.notificationService.showSuccess(response.message);
            this.getByeLaws();
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
