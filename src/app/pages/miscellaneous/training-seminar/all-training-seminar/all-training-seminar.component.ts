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
  DeleteTrainingSeminar,
  GetTrainingSeminar,
} from "src/app/shared/store/action/miscellaneous.action";
import { appConfig } from "src/app/core/config/config";
import { NotificationService } from "src/app/shared/services/notification.service";

@Component({
  selector: "app-all-training-seminar",
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
  templateUrl: "./all-training-seminar.component.html",
  styleUrl: "./all-training-seminar.component.scss",
})
export class AllTrainingSeminarComponent {
  private destroy$ = new Subject<void>();

  training_seminars$: Observable<any> = inject(Store).select(
    MiscellaneousState.training_seminar
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
      { title: "Name", dataField: "name" },
      {
        title: "Role",
        dataField: "role",
      },
      { title: "Title", dataField: "title" },
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
    this.getTrainingSeminars();
    this.updateTrainingSeminarLabels();
  }

  getTrainingSeminars() {
    this.store.dispatch(new GetTrainingSeminar({}));
  }

  private updateTrainingSeminarLabels() {
    this.training_seminars$.pipe(takeUntil(this.destroy$)).subscribe((ts) => {
      if (!ts) return;

      const training_seminars = ts.data?.map((item: any) => {
        return item;
      });

      this.tableConfig.data = training_seminars || [];
      this.tableConfig.total = ts.total || 0;
    });
  }

  onTableChange(data?: Params) {
    this.filter = { ...this.filter, ...data };
    this.store.dispatch(new GetTrainingSeminar(this.filter));
  }

  onActionClicked(action: TableClickedAction) {
    if (action.actionToPerform == "edit") this.edit(action.data);
    else if (action.actionToPerform == "delete") this.delete(action.data);
  }

  edit(data: any) {
    this.router.navigateByUrl(
      `/miscellaneous/edit-training-seminar/${data.id}`
    );
  }

  delete(data: any) {
    this.store
      .dispatch(new DeleteTrainingSeminar(data.id))
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          const response = res?.miscellaneous?.response;
          if (response.status === appConfig.statusCode.ok) {
            this.notificationService.showSuccess(response.message);
            this.getTrainingSeminars();
          }
        },
        error: (err) => {
          this.notificationService.showError(
            err?.message || "Failed to delete training seminar!"
          );
        },
      });
  }
}
