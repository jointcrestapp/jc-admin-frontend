import { Component, inject } from "@angular/core";
import { Params } from "@angular/router";
import { Select, Store } from "@ngxs/store";
import { Observable, Subject, takeUntil } from "rxjs";
import { SubscriptionState } from "../../shared/store/state/subscription.state";
import { GetSubscriptionList } from "../../shared/store/action/subscription.action";
import { TableConfig } from "../../shared/interface/table.interface";
import {
  Subscription,
  SubscriptionModel,
} from "../../shared/interface/subscription.interface";
import { PageWrapperComponent } from "../../shared/components/page-wrapper/page-wrapper.component";
import { TableComponent } from "../../shared/components/ui/table/table.component";

@Component({
  selector: "app-subscription",
  imports: [PageWrapperComponent, TableComponent],
  templateUrl: "./subscription.component.html",
  styleUrl: "./subscription.component.scss",
})
export class SubscriptionComponent {
  private destroy$ = new Subject<void>();
  subscribe$: Observable<SubscriptionModel> = inject(Store).select(
    SubscriptionState.subscribeList
  );

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

  constructor(private store: Store) {}

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
    this.store.dispatch(new GetSubscriptionList(data!));
  }
}
