import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  Renderer2,
} from "@angular/core";
import { CommonModule, DOCUMENT, isPlatformBrowser } from "@angular/common";
import { RouterModule } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { Store } from "@ngxs/store";
import { Observable, Subject, takeUntil } from "rxjs";
import { Select2Data, Select2Module, Select2UpdateEvent } from "ng-select2-component";
import { PageWrapperComponent } from "../../../shared/components/page-wrapper/page-wrapper.component";
import { TableComponent } from "../../../shared/components/ui/table/table.component";
import { InvestmentsState } from "../../../shared/store/state/investment.state";
import {
  GetInvestmentHistories,
  GetInvestments,
} from "../../../shared/store/action/investment.action";
import { Params } from "../../../shared/interface/core.interface";
import { TableClickedAction, TableConfig } from "../../../shared/interface/table.interface";

@Component({
  selector: "app-investment-history",
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    Select2Module,
    PageWrapperComponent,
    TableComponent,
  ],
  templateUrl: "./investment-history.component.html",
  styleUrl: "./investment-history.component.scss",
})
export class InvestmentHistoryComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  histories$: Observable<any> = this.store.select(InvestmentsState.investmentHistories);
  investments$: Observable<any> = this.store.select(InvestmentsState.investments);
  isLoading$: Observable<boolean> = this.store.select(InvestmentsState.isLoading);

  public investmentOptions: Select2Data = [];
  public isBrowser: boolean;

  public filter: Params = {
    search: "",
    investment_id: "",
    start_date: "",
    end_date: "",
    page: 1,
    paginate: 15,
  };

  public tableConfig: TableConfig = {
    columns: [
      { title: "Date", dataField: "date", type: "date" },
      { title: "Member ID", dataField: "member_id" },
      { title: "First Name", dataField: "first_name" },
      { title: "Last Name", dataField: "last_name" },
      { title: "Email", dataField: "email" },
      { title: "Investment Pool", dataField: "investment_name" },
      { title: "Pool Fund", dataField: "investment_fund", type: "price" },
      { title: "ROI (%)", dataField: "roi" },
      { title: "Amount Invested", dataField: "amount", type: "price" },
    ],
    rowActions: [],
    data: [],
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
    this.load();

    // Populate investment pool filter dropdown
    this.store.dispatch(new GetInvestments({}));
    this.investments$.pipe(takeUntil(this.destroy$)).subscribe((inv: any) => {
      this.investmentOptions = (inv?.data ?? []).map((i: any) => ({
        value: i.id,
        label: i.name,
      }));
    });

    this.histories$.pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this.tableConfig.data = res?.data ?? [];
      this.tableConfig.total = res?.total ?? 0;
    });
  }

  load() {
    const params: Params = {};
    if (this.filter["search"])       params["search"]        = this.filter["search"];
    if (this.filter["investment_id"]) params["investment_id"] = this.filter["investment_id"];
    if (this.filter["start_date"])   params["start_date"]    = this.filter["start_date"];
    if (this.filter["end_date"])     params["end_date"]      = this.filter["end_date"];
    params["page"]     = this.filter["page"]     ?? 1;
    params["paginate"] = this.filter["paginate"] ?? 15;
    this.store.dispatch(new GetInvestmentHistories(params));
  }

  onTableChange(data?: Params) {
    this.filter = { ...this.filter, ...data };
    this.load();
  }

  onActionClicked(_action: TableClickedAction) {}

  applyPoolFilter(event: Select2UpdateEvent) {
    this.filter["investment_id"] = event?.value ?? "";
    this.filter["page"] = 1;
    this.load();
  }

  clearPoolFilter() {
    this.filter["investment_id"] = "";
    this.filter["page"] = 1;
    this.load();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.renderer.removeClass(this.document.body, "loader-none");
  }
}
