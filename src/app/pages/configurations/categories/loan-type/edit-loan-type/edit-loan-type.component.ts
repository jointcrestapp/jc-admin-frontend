import { Component, OnDestroy, OnInit } from "@angular/core";
import { CommonModule, Location } from "@angular/common";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { Store } from "@ngxs/store";
import { Subject, switchMap, mergeMap, of, take, takeUntil } from "rxjs";

import { PageWrapperComponent } from "src/app/shared/components/page-wrapper/page-wrapper.component";
import { FormLoanTypeComponent } from "../loan-type-form/form-loan-type.component";
import { ButtonComponent } from "../../../../../shared/components/ui/button/button.component";
import { ConfigurationsState } from "src/app/shared/store/state/configurations.state";
import { EditLoanType } from "src/app/shared/store/action/configurations.action";

@Component({
  selector: "app-edit-loan-type",
  imports: [
    CommonModule,
    PageWrapperComponent,
    FormLoanTypeComponent,
    RouterModule,
    ButtonComponent,
  ],
  templateUrl: "./edit-loan-type.component.html",
  styleUrl: "./edit-loan-type.component.scss",
})
export class EditLoanTypeComponent implements OnInit, OnDestroy {
  returnTab: string = "loan_type";
  returnUrl: string = "/configurations/categories";
  selectedLoanType: any = null;

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private store: Store,
  ) {}

  ngOnInit() {
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      if (params["returnTab"]) this.returnTab = params["returnTab"];
      if (params["returnUrl"]) this.returnUrl = params["returnUrl"];
    });

    this.route.params
      .pipe(
        switchMap((params) => {
          if (!params["id"]) return of(null);
          return this.store
            .dispatch(new EditLoanType(params["id"]))
            .pipe(
              mergeMap(() =>
                this.store.select(ConfigurationsState.selectedLoanType).pipe(take(1))
              )
            );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((lt) => {
        this.selectedLoanType = lt ?? null;
      });
  }

  goBack() {
    this.router.navigate([this.returnUrl], {
      queryParams: { tab: this.returnTab },
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
