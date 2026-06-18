import {
  Component,
  inject,
  Inject,
  PLATFORM_ID,
} from "@angular/core";
import { Store } from "@ngxs/store";
import { Observable, Subject, finalize, takeUntil } from "rxjs";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { CommonModule, isPlatformBrowser } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { FormFieldsComponent } from "../../../shared/components/ui/form-fields/form-fields.component";
import { ButtonComponent } from "../../../shared/components/ui/button/button.component";
import { Select2Data, Select2Module, Select2UpdateEvent } from "ng-select2-component";
import {
  CreateDividend,
  GetMonthlyProfits,
  SetLoadingState,
} from "src/app/shared/store/action/dividend.action";
import { DividendState } from "src/app/shared/store/state/dividend.state";
import { FinancialSettingsState } from "src/app/shared/store/state/financial-settings.state";
import { GetFinancialSettingsList } from "src/app/shared/store/action/financial-settings.action";
import { NotificationService } from "src/app/shared/services/notification.service";
import { appConfig } from "src/app/core/config/config";

@Component({
  selector: "app-form-dividend",
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    Select2Module,
    FormFieldsComponent,
    ButtonComponent,
  ],
  templateUrl: "./form-dividend.component.html",
  styleUrl: "./form-dividend.component.scss",
})
export class FormDividendComponent {
  private destroy$ = new Subject<void>();

  monthlyProfits$: Observable<any> = inject(Store).select(DividendState.monthlyProfits);
  isLoading$: Observable<any> = inject(Store).select(DividendState.isLoading);
  financialSettings$: Observable<any> = inject(Store).select(FinancialSettingsState.financialSettings);

  public form: FormGroup;
  public isBrowser: boolean;
  public yearlyTotal: number = 0;
  public declaredPool: number = 0;
  public selectedYear: number = new Date().getFullYear();

  public years: Select2Data = [];

  constructor(
    private store: Store,
    private router: Router,
    private fb: FormBuilder,
    private notificationService: NotificationService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.form = this.fb.group({
      year: new FormControl(new Date().getFullYear(), [Validators.required]),
      dividendPercent: new FormControl('', [
        Validators.required,
        Validators.min(0.01),
        Validators.max(100),
      ]),
    });

    this.form.get('dividendPercent')?.valueChanges.subscribe(() => this.recalcPool());
  }

  ngOnInit() {
    const current = new Date().getFullYear();
    this.years = Array.from({ length: 10 }, (_, i) => ({
      value: current - i,
      label: (current - i).toString(),
    }));

    this.loadYearlyTotal(this.selectedYear);

    this.store.dispatch(new GetFinancialSettingsList());
    this.financialSettings$.pipe(takeUntil(this.destroy$)).subscribe((settings) => {
      if (settings?.dividend_percent != null && !this.form.get('dividendPercent')?.dirty) {
        this.form.get('dividendPercent')?.setValue(settings.dividend_percent, { emitEvent: false });
        this.recalcPool();
      }
    });

    this.monthlyProfits$.pipe(takeUntil(this.destroy$)).subscribe((mp) => {
      this.yearlyTotal = mp?.yearly_total || 0;
      this.recalcPool();
    });
  }

  loadYearlyTotal(year: number) {
    this.store.dispatch(new GetMonthlyProfits({ year, paginate: 50 }));
  }

  onYearChange(event: Select2UpdateEvent) {
    if (event?.value) {
      this.selectedYear = parseInt(event.value as string);
      this.form.get('year')?.setValue(this.selectedYear);
      this.loadYearlyTotal(this.selectedYear);
    }
  }

  recalcPool() {
    const pct = parseFloat(this.form.get('dividendPercent')?.value) || 0;
    this.declaredPool = (pct / 100) * this.yearlyTotal;
  }

  submit() {
    this.form.markAllAsTouched();
    if (!this.form.valid) return;

    if (this.yearlyTotal <= 0) {
      this.notificationService.showError(
        `No monthly profit entries for ${this.selectedYear}. Please add profit data first.`
      );
      return;
    }

    this.store.dispatch(new SetLoadingState(true));
    this.store
      .dispatch(new CreateDividend(this.form.value))
      .pipe(
        finalize(() => this.store.dispatch(new SetLoadingState(false))),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (res: any) => {
          const response = res?.dividend?.response;
          if (
            response?.status === appConfig.statusCode.created ||
            response?.status === appConfig.statusCode.ok
          ) {
            this.notificationService.showSuccess(
              response?.message || 'Dividends declared successfully'
            );
            this.router.navigateByUrl('/dividend');
          } else {
            this.notificationService.showError(response?.message || 'Failed to declare dividends');
          }
        },
        error: (err) => {
          this.notificationService.showError(err?.message || 'An unexpected error occurred');
        },
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
