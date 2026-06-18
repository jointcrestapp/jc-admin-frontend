import {
  Component,
  inject,
  Inject,
  PLATFORM_ID,
} from "@angular/core";
import { Store } from "@ngxs/store";
import { Observable, Subject, takeUntil } from "rxjs";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { CommonModule, isPlatformBrowser } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { RouterModule } from "@angular/router";
import { Select2Data, Select2Module, Select2UpdateEvent } from "ng-select2-component";
import { PageWrapperComponent } from "../../../shared/components/page-wrapper/page-wrapper.component";
import { HasPermissionDirective } from "../../../shared/directive/has-permission.directive";
import { FormFieldsComponent } from "../../../shared/components/ui/form-fields/form-fields.component";
import { ButtonComponent } from "../../../shared/components/ui/button/button.component";
import { DividendState } from "src/app/shared/store/state/dividend.state";
import {
  AddMonthlyProfit,
  DeleteMonthlyProfit,
  GetMonthlyProfits,
} from "src/app/shared/store/action/dividend.action";
import { NotificationService } from "src/app/shared/services/notification.service";
import { appConfig } from "src/app/core/config/config";

@Component({
  selector: "app-monthly-profits",
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    Select2Module,
    PageWrapperComponent,
    HasPermissionDirective,
    FormFieldsComponent,
    ButtonComponent,
  ],
  templateUrl: "./monthly-profits.component.html",
  styleUrl: "./monthly-profits.component.scss",
})
export class MonthlyProfitsComponent {
  private destroy$ = new Subject<void>();

  monthlyProfits$: Observable<any> = inject(Store).select(
    DividendState.monthlyProfits
  );
  isLoading$: Observable<any> = inject(Store).select(DividendState.isLoading);

  public isBrowser: boolean;
  public form: FormGroup;
  public selectedYear: number = new Date().getFullYear();
  public yearlyTotal: number = 0;

  public months: Select2Data = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  public years: Select2Data = [];

  constructor(
    private store: Store,
    private fb: FormBuilder,
    private notificationService: NotificationService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.form = this.fb.group({
      month: [null, Validators.required],
      year: [new Date().getFullYear(), Validators.required],
      amount: [null, [Validators.required, Validators.min(1)]],
      narration: [''],
    });
  }

  ngOnInit() {
    const current = new Date().getFullYear();
    this.years = Array.from({ length: 10 }, (_, i) => ({
      value: current - i,
      label: (current - i).toString(),
    }));

    this.load();

    this.monthlyProfits$.pipe(takeUntil(this.destroy$)).subscribe((mp) => {
      this.yearlyTotal = mp?.yearly_total || 0;
    });
  }

  load() {
    this.store.dispatch(new GetMonthlyProfits({ year: this.selectedYear, paginate: 50 }));
  }

  onYearFilter(event: Select2UpdateEvent) {
    if (event?.value) {
      this.selectedYear = parseInt(event.value as string);
      this.load();
    }
  }

  submit() {
    this.form.markAllAsTouched();
    if (!this.form.valid) return;

    const payload = { ...this.form.value };
    this.store
      .dispatch(new AddMonthlyProfit(payload))
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          const response = res?.dividend?.response;
          if (
            response?.status === appConfig.statusCode.created ||
            response?.status === appConfig.statusCode.ok
          ) {
            this.notificationService.showSuccess('Monthly profit added successfully');
            this.form.reset({ year: new Date().getFullYear() });
            this.load();
          } else {
            this.notificationService.showError(response?.message || 'Failed to add profit entry');
          }
        },
        error: (err) => {
          this.notificationService.showError(err?.message || 'An error occurred');
        },
      });
  }

  delete(id: number) {
    if (!confirm('Delete this profit entry?')) return;
    this.store
      .dispatch(new DeleteMonthlyProfit(id))
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          const response = res?.dividend?.response;
          if (response?.status === appConfig.statusCode.ok) {
            this.notificationService.showSuccess('Entry deleted');
            this.load();
          } else {
            this.notificationService.showError(response?.message || 'Delete failed');
          }
        },
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
