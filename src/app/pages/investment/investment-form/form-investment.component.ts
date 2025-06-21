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
  finalize,
  mergeMap,
  of,
  switchMap,
  takeUntil,
} from "rxjs";
import {
  Select2Data,
  Select2Module,
  Select2Option,
} from "ng-select2-component";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
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

  public years: Select2Data;

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
      roi: new FormControl("", [Validators.required]),
      rate: new FormControl(0, [
        Validators.required,
        Validators.pattern(/^\d+(\.\d{1,2})?$/),
      ]),
      start_date: new FormControl("", [Validators.required]),
      end_date: new FormControl("", [Validators.required]),
      maturity_year: new FormControl("", [Validators.required]),
      description: new FormControl(""),
    });
  }

  ngOnInit() {
    this.years = this.generateYearOptions();
    this.getInvestmentTypes();
    if (this.isBrowser) {
      this.editor = new Editor();
    }

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
                this.store.select(ConfigurationsState.selectedInvestmentType)
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
            amount: investment.amount,
            roi: investment.roi,
            rate: investment.rate,
            start_date: investment.start_date,
            end_date: investment.end_date,
            maturity_year: investment.maturity_year,
            description: investment.description,
          };
          this.form.patchValue(patchData);
        }
      });
  }

  generateYearOptions(
    startYear: number = new Date().getFullYear(),
    numberOfYears: number = 50
  ): any[] {
    return Array.from({ length: numberOfYears }, (_, i) => {
      const year = startYear + i;
      return {
        value: year,
        label: year.toString(),
      };
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
