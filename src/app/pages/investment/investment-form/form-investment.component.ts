import {
  Component,
  ElementRef,
  inject,
  Inject,
  Input,
  PLATFORM_ID,
  Renderer2,
  ViewChild,
} from "@angular/core";
import {
  NgbCalendar,
  NgbDateParserFormatter,
  NgbModule,
  NgbNav,
} from "@ng-bootstrap/ng-bootstrap";
import { Store } from "@ngxs/store";
import {
  Observable,
  Subject,
  combineLatest,
  finalize,
  mergeMap,
  of,
  startWith,
  switchMap,
  takeUntil,
} from "rxjs";
import {
  Select2Data,
  Select2Module,
  Select2Option,
} from "ng-select2-component";
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { Editor, NgxEditorModule } from "ngx-editor";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonModule, DOCUMENT, isPlatformBrowser } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { FormFieldsComponent } from "../../../shared/components/ui/form-fields/form-fields.component";
import { ButtonComponent } from "../../../shared/components/ui/button/button.component";
import { NavService } from "src/app/shared/services/nav.service";
import { Sidebar } from "src/app/shared/interface/sidebar.interface";
import { RouterModule } from "@angular/router";
import { ConfigurationsState } from "src/app/shared/store/state/configurations.state";
import { InvestmentsState } from "src/app/shared/store/state/investment.state";
import {
  CreateInvestment,
  EditInvestment,
  SetLoadingState,
  UpdateInvestment,
} from "src/app/shared/store/action/investment.action";
import { appConfig } from "src/app/core/config/config";
import { NotificationService } from "src/app/shared/services/notification.service";
import { GetInvestmentTypes } from "src/app/shared/store/action/configurations.action";

@Component({
  selector: "app-form-investment",
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    Select2Module,
    RouterModule,
    NgxEditorModule,
    FormFieldsComponent,
    ButtonComponent,
  ],
  templateUrl: "./form-investment.component.html",
  styleUrl: "./form-investment.component.scss",
})
export class FormInvestmentComponent {
  public investment_types$: Observable<any>;
  public searchResult: boolean = false;
  public searchResultEmpty: boolean = false;
  public text: string;
  public open = false;

  public tenureOptions: Select2Option[] = [
    { value: '6 months',  label: '6 Months' },
    { value: '12 months', label: '12 Months (1 Year)' },
    { value: '18 months', label: '18 Months' },
    { value: '24 months', label: '24 Months (2 Years)' },
    { value: '36 months', label: '36 Months (3 Years)' },
    { value: '5 years',   label: '5 Years' },
    { value: '10 years',  label: '10 Years' },
  ];

  public methods: Select2Option[] = [
    {
      value: "flat / fix rate",
      label: "Flat / Fix Rate",
    },
    {
      value: "simple interest",
      label: "Simple Interest",
    },
    {
      value: "reducing balance - balance",
      label: "Reducing Balance - Balance",
    },
    {
      value: "reducing balance - fixed",
      label: "Reducing Balance - Fixed",
    },
  ];

  public menuItems: Sidebar[];
  public items: Sidebar[] = [];

  @Input() type: string;
  @ViewChild("nav") nav: NgbNav;
  @ViewChild("toggleButton") toggleButton: ElementRef;
  @ViewChild("menu") menu: ElementRef;
  @ViewChild("dropdownContainer", { static: false })
  dropdownContainer: ElementRef;

  public attribute$: Observable<Select2Data>;
  public tabError: string[] | null = [];
  public maxRoi: number | null = null;

  private static endAfterStart(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const start = group.get('start_date')?.value;
      const end   = group.get('end_date')?.value;
      if (!start || !end) return null;
      return new Date(end) > new Date(start) ? null : { endBeforeStart: true };
    };
  }
  public form: FormGroup;
  public id: number;
  private destroy$ = new Subject<void>();
  public editor: Editor;
  public isBrowser: boolean;
  public investment_types: Select2Option[];

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private router: Router,
    public navServices: NavService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter,
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: object,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.investment_types$ = this.store.select(
      ConfigurationsState.investment_types
    );
    this.form = this.formBuilder.group({
      investment_type_id: new FormControl("", [Validators.required]),
      amount: new FormControl("", [Validators.required]),
      tenure: new FormControl(""),
      roi: new FormControl("", [Validators.required]),
      rate: new FormControl(0, [
        Validators.required,
        Validators.pattern(/^\d+(\.\d{1,2})?$/),
      ]),
      start_date: new FormControl("", [Validators.required]),
      end_date: new FormControl("", [Validators.required]),
      maturity_year: new FormControl("", [Validators.required]),
      description: new FormControl(""),
    }, { validators: FormInvestmentComponent.endAfterStart() });
  }

  private updateRoiMax(rate: number | string, tenure: string) {
    const months = this.tenureToMonths(tenure);
    const roiCtrl = this.form.get('roi');
    if (!rate || !months || !roiCtrl) {
      this.maxRoi = null;
      roiCtrl?.setValidators([Validators.required]);
      roiCtrl?.updateValueAndValidity({ emitEvent: false });
      return;
    }
    this.maxRoi = parseFloat((Number(rate) * (months / 12)).toFixed(2));
    roiCtrl.setValidators([Validators.required, Validators.max(this.maxRoi)]);
    roiCtrl.updateValueAndValidity({ emitEvent: false });
  }

  private tenureToMonths(tenure: string): number | null {
    if (!tenure) return null;
    const m = tenure.match(/(\d+)\s*month/i);
    const y = tenure.match(/(\d+)\s*year/i);
    if (m) return parseInt(m[1], 10);
    if (y) return parseInt(y[1], 10) * 12;
    return null;
  }

  private autoComputeDates(startDate: string, tenure: string) {
    const months = this.tenureToMonths(tenure);
    if (!startDate || !months) return;
    const start = new Date(startDate);
    if (isNaN(start.getTime())) return;
    start.setMonth(start.getMonth() + months);
    const endDateStr = start.toISOString().split('T')[0];
    const maturityYear = start.getFullYear();
    this.form.get('end_date')?.setValue(endDateStr, { emitEvent: false });
    this.form.get('maturity_year')?.setValue(maturityYear, { emitEvent: false });
  }

  ngOnInit() {
    this.getInvestmentTypes();
    if (this.isBrowser) {
      this.editor = new Editor();
    }

    combineLatest([
      this.form.get('start_date')!.valueChanges.pipe(startWith(this.form.get('start_date')!.value)),
      this.form.get('tenure')!.valueChanges.pipe(startWith(this.form.get('tenure')!.value)),
    ]).pipe(takeUntil(this.destroy$)).subscribe(([startDate, tenure]) => {
      this.autoComputeDates(startDate, tenure);
    });

    this.form.get('end_date')!.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(endDate => {
        if (!endDate) return;
        const d = new Date(endDate);
        if (!isNaN(d.getTime())) {
          this.form.get('maturity_year')?.setValue(d.getFullYear(), { emitEvent: false });
        }
      });

    combineLatest([
      this.form.get('rate')!.valueChanges.pipe(startWith(this.form.get('rate')!.value)),
      this.form.get('tenure')!.valueChanges.pipe(startWith(this.form.get('tenure')!.value)),
    ]).pipe(takeUntil(this.destroy$)).subscribe(([rate, tenure]) => {
      this.updateRoiMax(rate, tenure);
    });

    this.investment_types$.pipe(takeUntil(this.destroy$)).subscribe((it) => {
      this.investment_types = it?.data?.filter((element: any) => {
        element.value = element.id;
        element.label = element.name;
        return element;
      });
    });

    this.route.params
      .pipe(
        switchMap((params) => {
          if (!params["id"]) return of();
          return this.store
            .dispatch(new EditInvestment(params["id"]))
            .pipe(
              mergeMap(() =>
                this.store.select(InvestmentsState.selectedInvestment)
              )
            );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((investment) => {
        if (investment) {
          this.id = investment.id;
          let patchData: any = {
            investment_type_id: investment.investment_type_id,
            amount: investment.total_investment_fund ?? investment.amount,
            tenure: investment.tenure || '',
            roi: investment.roi,
            rate: investment.rate,
            start_date: investment.start_date,
            end_date: investment.end_date,
            maturity_year: investment.maturity_year
              ? (typeof investment.maturity_year === 'number'
                  ? investment.maturity_year
                  : new Date(investment.maturity_year).getFullYear())
              : '',
            description: investment.description,
          };
          this.form.patchValue(patchData);
        }
      });
  }

  getInvestmentTypes() {
    this.store.dispatch(new GetInvestmentTypes({}));
  }

  incrementRate() {
    const currentRate = this.form.get("rate")?.value || 0;
    this.form.get("rate")?.setValue(currentRate + 0.01);
  }

  decrementRate() {
    const currentRate = this.form.get("rate")?.value || 0;
    if (currentRate > 0) {
      this.form.get("rate")?.setValue(currentRate - 0.01);
    }
  }

  submit() {
    this.form.markAllAsTouched();
    if (!this.form.valid) {
      return;
    }

    let payload = { ...this.form.value };
    // DB column is DATE type; convert bare integer year to a valid date string
    if (payload.maturity_year && typeof payload.maturity_year === 'number') {
      payload.maturity_year = `${payload.maturity_year}-01-01`;
    }
    this.store.dispatch(new SetLoadingState(true));
    let action: any;

    if (this.type == "edit" && this.id) {
      action = new UpdateInvestment(payload, this.id);
    }

    if (this.type === "create") {
      action = new CreateInvestment(payload);
    }

    this.store
      .dispatch(action)
      .pipe(
        finalize(() => this.store.dispatch(new SetLoadingState(false))),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (res: any) => {
          const response = res?.investments?.response;
          const successStatus =
            this.type === "edit"
              ? appConfig.statusCode.ok
              : appConfig.statusCode.created;
          if (response?.status === successStatus) {
            const successMessage =
              this.type === "edit"
                ? "Investment updated successfully"
                : "Investment created successfully";
            this.notificationService.showSuccess(
              response?.message || successMessage
            );
            this.router.navigateByUrl("/investment");
            this.tabError = [];
          } else {
            this.tabError = [];
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

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.form.reset();
    this.renderer.removeClass(this.document.body, "loader-none");
  }
}
