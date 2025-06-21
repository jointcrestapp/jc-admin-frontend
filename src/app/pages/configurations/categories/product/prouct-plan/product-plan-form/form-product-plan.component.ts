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
import { FormFieldsComponent } from "../../../../../../shared/components/ui/form-fields/form-fields.component";
import { ButtonComponent } from "../../../../../../shared/components/ui/button/button.component";
import { NavService } from "src/app/shared/services/nav.service";
import { Sidebar } from "src/app/shared/interface/sidebar.interface";
import { RouterModule } from "@angular/router";
import { ConfigurationsState } from "src/app/shared/store/state/configurations.state";
import {
  CreateProductPlan,
  EditProductPlan,
  SetLoadingState,
  UpdateProductPlan,
} from "src/app/shared/store/action/configurations.action";
import { appConfig } from "src/app/core/config/config";
import { NotificationService } from "src/app/shared/services/notification.service";

@Component({
  selector: "app-form-product-plan",
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
  templateUrl: "./form-product-plan.component.html",
  styleUrl: "./form-product-plan.component.scss",
})
export class FormProductPlanComponent {
  public searchResult: boolean = false;
  public searchResultEmpty: boolean = false;
  public text: string;
  public open = false;

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
    this.form = this.formBuilder.group({
      name: new FormControl("", [Validators.required]),
      rate: new FormControl("", [Validators.required]),
      guarantors: new FormControl("", [Validators.required]),
      min_month: new FormControl("", [Validators.required]),
      max_month: new FormControl("", [Validators.required]),
      cal_method: new FormControl("", [Validators.required]),
      description: new FormControl(""),
    });
  }

  ngOnInit() {
    if (this.isBrowser) {
      this.editor = new Editor();
    }
    this.route.params
      .pipe(
        switchMap((params) => {
          if (!params["id"]) return of();
          return this.store
            .dispatch(new EditProductPlan(params["id"]))
            .pipe(
              mergeMap(() =>
                this.store.select(ConfigurationsState.selectedProductPlan)
              )
            );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((prod_plan) => {
        console.log("Prod Plan ::::::::::::::::", prod_plan);
        if (prod_plan) {
          this.id = prod_plan.id;
          let patchData: any = {
            name: prod_plan.name,
            rate: prod_plan.rate,
            guarantors: prod_plan.guarantors,
            cal_method: prod_plan.cal_method,
            min_month: prod_plan.min_month,
            max_month: prod_plan.max_month,
            description: prod_plan.description,
          };
          this.form.patchValue(patchData);
        }
      });
  }

  incrementRate(field: string) {
    if (field === "rate") {
      const currentRate = this.form.get("rate")?.value || 0;
      this.form.get("rate")?.setValue(currentRate + 1);
    } else if (field === "guarantors") {
      const currentRate = this.form.get("guarantors")?.value || 0;
      this.form.get("guarantors")?.setValue(currentRate + 1);
    } else if (field === "min_month") {
      const currentRate = this.form.get("min_month")?.value || 0;
      this.form.get("min_month")?.setValue(currentRate + 1);
    } else {
      const currentRate = this.form.get("max_month")?.value || 0;
      this.form.get("max_month")?.setValue(currentRate + 1);
    }
  }

  decrementRate(field: string) {
    const currentRate = this.form.get("rate")?.value || 0;
    const currentGuarantors = this.form.get("guarantors")?.value || 0;
    const currentMinMonth = this.form.get("min_month")?.value || 0;
    const currentMaxMonth = this.form.get("max_month")?.value || 0;
    if (field === "rate" && currentRate > 0) {
      this.form.get("rate")?.setValue(currentRate - 1);
    } else if (field === "min_month" && currentMinMonth > 0) {
      this.form.get("min_month")?.setValue(currentRate - 1);
    } else if (field === "max_month" && currentMaxMonth > 0) {
      this.form.get("max_month")?.setValue(currentRate - 1);
    } else if (field === "guarantors" && currentGuarantors > 0) {
      this.form.get("guarantors")?.setValue(currentRate - 1);
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
      action = new UpdateProductPlan(payload, this.id);
    }

    if (this.type === "create") {
      action = new CreateProductPlan(payload);
    }

    this.store
      .dispatch(action)
      .pipe(
        finalize(() => this.store.dispatch(new SetLoadingState(false))),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (res: any) => {
          const response = res?.configurations?.response;
          const successStatus =
            this.type === "edit"
              ? appConfig.statusCode.ok
              : appConfig.statusCode.created;
          if (response?.status === successStatus) {
            const successMessage =
              this.type === "edit"
                ? "Product Plan updated successfully"
                : "Product Plan created successfully";
            this.notificationService.showSuccess(
              response?.message || successMessage
            );
            this.router.navigateByUrl("/configurations/categories");
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
