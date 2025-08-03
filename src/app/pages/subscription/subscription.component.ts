import {
  Component,
  Inject,
  inject,
  PLATFORM_ID,
  Renderer2,
} from "@angular/core";
import { Params } from "@angular/router";
import { Select, Store } from "@ngxs/store";
import { Observable, Subject, takeUntil } from "rxjs";
import { TranslateModule } from "@ngx-translate/core";
import { SubscriptionState } from "../../shared/store/state/subscription.state";
import { GetSubscriptionList } from "../../shared/store/action/subscription.action";
import { TableConfig } from "../../shared/interface/table.interface";
import {
  Subscription,
  SubscriptionModel,
} from "../../shared/interface/subscription.interface";
import { PageWrapperComponent } from "../../shared/components/page-wrapper/page-wrapper.component";
import { TableComponent } from "../../shared/components/ui/table/table.component";
import { DOCUMENT, isPlatformBrowser } from "@angular/common";
import {
  Select2Data,
  Select2Module,
  Select2Option,
  Select2UpdateEvent,
} from "ng-select2-component";

@Component({
  selector: "app-subscription",
  imports: [
    PageWrapperComponent,
    TranslateModule,
    TableComponent,
    Select2Module,
  ],
  templateUrl: "./subscription.component.html",
  styleUrl: "./subscription.component.scss",
})
export class SubscriptionComponent {
  private destroy$ = new Subject<void>();
  subscribe$: Observable<SubscriptionModel> = inject(Store).select(
    SubscriptionState.subscribeList
  );

  public subStatus: Select2Data = [
    {
      value: "0",
      label: "Unpaid",
    },
    {
      value: "1",
      label: "Paid",
    },
  ];

  public filter: Params = {
    search: "",
    field: "",
    status: "",
    sort: "", // current Sorting Order
    page: 1, // current page number
    paginate: 15, // Display per page,
  };

  public open: boolean = true;
  public isBrowser: boolean;

  public tableConfig: TableConfig = {
    columns: [
      { title: "Member ID", dataField: "member_id" },
      { title: "Full Name", dataField: "full_name" },
      {
        title: "email",
        dataField: "email",
        sortable: true,
        sort_direction: "desc",
      },
      { title: "Amount", dataField: "amount", type: "price" },
      { title: "Status", dataField: "sub_status" },
      {
        title: "End Date",
        dataField: "end_date",
        type: "date",
        sortable: true,
        sort_direction: "desc",
      },
    ],
    data: [] as Subscription[],
    total: 0,
  };

  constructor(
    private store: Store,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: object,
    private renderer: Renderer2
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    this.subscribe$.pipe(takeUntil(this.destroy$)).subscribe((subscribe) => {
      let subscriptions = subscribe?.data?.filter((element: any) => {
        element.sub_status =
          element.sub_status == "0"
            ? `<div class="status-danger"><span>Unpaid</span></div>`
            : `<div class="status-success"><span>Paid</span></div>`;
        return element;
      });
      this.tableConfig.data = subscribe ? subscribe?.data : [];
      this.tableConfig.total = subscribe ? subscribe?.total : 0;
    });
  }

  onTableChange(data?: Params) {
    this.filter = { ...this.filter, ...data };
    this.store.dispatch(new GetSubscriptionList(this.filter));
  }

  applyFilter(data: Select2UpdateEvent) {
    this.filter["status"] = data && data.value ? data.value : null;
    if (!this.filter["status"]) {
      delete this.filter["status"];
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
