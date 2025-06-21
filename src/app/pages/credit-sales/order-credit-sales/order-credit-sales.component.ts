import { Component, inject, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { PageWrapperComponent } from "../../../shared/components/page-wrapper/page-wrapper.component";
import { TableComponent } from "../../../shared/components/ui/table/table.component";
import { ImportCsvModalComponent } from "../../../shared/components/ui/modal/import-csv-modal/import-csv-modal.component";
import { Store } from "@ngxs/store";
import { CreditState } from "../../../shared/store/state/credit.state";
import { finalize, Observable, Subject, takeUntil } from "rxjs";
import {
  TableClickedAction,
  TableConfig,
} from "../../../shared/interface/table.interface";
import { Params } from "../../../shared/interface/core.interface";
import {
  OrderCreditSales,
  SetLoadingState,
  AddCreditSales,
} from "../../../shared/store/action/credit.action";
import { CommonModule } from "@angular/common";
import { appConfig } from "src/app/core/config/config";
import { NotificationService } from "src/app/shared/services/notification.service";

@Component({
  selector: "app-order-credit-sales",
  imports: [
    RouterModule,
    TranslateModule,
    PageWrapperComponent,
    TableComponent,
    ImportCsvModalComponent,
    CommonModule,
  ],
  templateUrl: "./order-credit-sales.component.html",
  styleUrl: "./order-credit-sales.component.scss",
})
export class OrderCreditSalesComponent {
  private destroy$ = new Subject<void>();
  private store = inject(Store);
  allUsers: any[];
  order_credit_sales$: Observable<any> = this.store.select(
    CreditState.order_credit_sales
  );
  isLoading$: Observable<boolean> = this.store.select(CreditState.isLoading);

  @ViewChild("csvModal") CSVModal: ImportCsvModalComponent;

  @ViewChild(TableComponent) confirmAction: TableComponent; // Get reference to the modal component in the table component

  public tableConfig: TableConfig = {
    columns: [
      {
        title: "Product",
        dataField: "product",
      },
      {
        title: "Category",
        dataField: "category",
      },
      { title: "Vendor", dataField: "vendor" },
      { title: "Available", dataField: "available" },
      { title: "Price", dataField: "price", type: "price" },
    ],
    rowActions: [
      {
        label: "Order",
        actionToPerform: "order",
        icon: "ri-shopping-cart-line",
        permission: "credit.create",
      },
    ],
    //data: [] as User[],
    data: [] as any[],
    total: 0,
  };

  constructor(
    private notificationService: NotificationService,
    public router: Router
  ) {}

  ngOnInit() {
    this.orderCreditSales();
    this.order_credit_sales$.pipe(takeUntil(this.destroy$)).subscribe((ocs) => {
      let order_credit_sales = ocs?.data?.filter((element: any) => {
        return element;
      });
      this.tableConfig.data = ocs ? ocs?.data : [];
      this.tableConfig.total = ocs ? ocs.total : ocs?.length;
    });
  }

  orderCreditSales(): void {
    this.store.dispatch(new OrderCreditSales({}));
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onTableChange(data?: Params) {
    console.log("Params :::", data);
    this.store.dispatch(new OrderCreditSales(data));
  }

  onActionClicked(action: TableClickedAction) {
    if (action.actionToPerform == "edit") this.edit(action.data);
    else if (action.actionToPerform == "is_activated") this.status(action.data);
    else if (action.actionToPerform == "detail") this.view(action.data);
    else if (action.actionToPerform == "delete") this.delete(action.data);
    else if (action.actionToPerform == "deleteAll") this.deleteAll(action.data);
    else if (action.actionToPerform == "order")
      this.addCreditSales(action.data);
  }

  edit(data: any) {
    this.router.navigateByUrl(`/user/edit/${data.id}`);
  }
  view(data: any) {
    this.router.navigateByUrl(`/user/detail/${data.id}`);
  }

  addCreditSales(data: any) {
    this.store.dispatch(new SetLoadingState(true));
    let action: any;
    action = new AddCreditSales(data);
    this.store
      .dispatch(action)
      .pipe(
        finalize(() => this.store.dispatch(new SetLoadingState(false))),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (res: any) => {
          const response = res?.credit?.response;
          if (response?.status === appConfig.statusCode.created) {
            this.notificationService.showSuccess(response?.message);
            this.router.navigateByUrl("/credit-sales/order-credit-sales");
          } else {
            this.notificationService.showError(
              response?.message || "Update failed"
            );
          }
        },
        error: (err) => {
          this.notificationService.showError(
            err?.message || "An unexpected error occurred"
          );
        },
      });
  }

  status(data: any) {
    // this.store
    //   .dispatch(new UpdateUserStatus(data.id, data.is_activated))
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe({
    //     next: (res: any) => {
    //       console.log("Status update ::::::", res);
    //       const response = res?.user?.response;
    //       if (response.status === appConfig.statusCode.ok) {
    //         this.notificationService.showSuccess(response.message);
    //         this.getUsers(); // Refresh the list after status update
    //       }
    //     },
    //     error: (err) => {
    //       this.notificationService.showError(
    //         err?.message || "Failed to update user status"
    //       );
    //     },
    //   });
  }

  delete(data: any) {
    // this.store
    //   .dispatch(new DeleteUser(data.id))
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe({
    //     next: (res: any) => {
    //       const response = res?.user?.response;
    //       if (response.status === appConfig.statusCode.ok) {
    //         this.notificationService.showSuccess(response.message);
    //         this.getUsers(); // Refresh the list after status update
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
    // this.store
    //   .dispatch(new DeleteAllUser(ids))
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe({
    //     next: (res: any) => {
    //       const response = res?.user?.response;
    //       if (response.status === appConfig.statusCode.ok) {
    //         this.notificationService.showSuccess(response.message);
    //         // this.getUsers();
    //       }
    //     },
    //     error: (err) => {
    //       this.notificationService.showError(
    //         err?.message || "Failed to delete user!"
    //       );
    //     },
    //   });
  }

  export() {
    // this.store.dispatch(new ExportUser());
  }
}
