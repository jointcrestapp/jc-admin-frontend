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
  CreateProduct,
  EditProduct,
  SetLoadingState,
  UpdateProduct,
  GetVendors,
  GetProductPlans,
} from "src/app/shared/store/action/configurations.action";
import { appConfig } from "src/app/core/config/config";
import { NotificationService } from "src/app/shared/services/notification.service";

@Component({
  selector: "app-form-product",
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
  templateUrl: "./form-product.component.html",
  styleUrl: "./form-product.component.scss",
})
export class FormProductComponent {
  public searchResult: boolean = false;
  public searchResultEmpty: boolean = false;
  public text: string;
  public open = false;

  public categories: Select2Option[] = [
    {
      value: "category 1",
      label: "Category 1",
    },
    {
      value: "category 2",
      label: "Category 2",
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
  public vendors$: Observable<any>;
  public product_plans$: Observable<any>;
  public tabError: string[] | null = [];
  public form: FormGroup;
  public id: number;
  private destroy$ = new Subject<void>();
  public editor: Editor;
  public isBrowser: boolean;
  vendors: any[];
  product_plans: any[];

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
    this.vendors$ = this.store.select(ConfigurationsState.vendors);
    this.product_plans$ = this.store.select(ConfigurationsState.product_plans);
    this.form = this.formBuilder.group({
      name: new FormControl("", [Validators.required]),
      category: new FormControl("", [Validators.required]),
      vendor_id: new FormControl("", [Validators.required]),
      price: new FormControl("", [Validators.required]),
      stock: new FormControl("", [Validators.required]),
      product_plan_id: new FormControl("", [Validators.required]),
      description: new FormControl(""),
    });
  }

  ngOnInit() {
    if (this.isBrowser) {
      this.editor = new Editor();
    }
    this.getVendors();
    this.getProductPlans();
    this.vendors$.pipe(takeUntil(this.destroy$)).subscribe((vendor) => {
      this.vendors = vendor?.data.filter((element: any) => {
        element.value = element.id;
        element.label = element.name;
        return element;
      });
    });
    this.product_plans$
      .pipe(takeUntil(this.destroy$))
      .subscribe((prod_plan) => {
        this.product_plans = prod_plan?.data.filter((element: any) => {
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
            .dispatch(new EditProduct(params["id"]))
            .pipe(
              mergeMap(() =>
                this.store.select(ConfigurationsState.selectedProduct)
              )
            );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((prod) => {
        console.log("Prod ::::::::::::::::", prod);
        if (prod) {
          this.id = prod.id;
          let patchData: any = {
            name: prod.product,
            category: prod.category,
            vendor_id: prod.vendor_id,
            price: prod.price,
            stock: prod.stock,
            product_plan_id: prod.product_plan_id,
            description: prod.description,
          };
          this.form.patchValue(patchData);
        }
      });
  }

  getVendors() {
    this.store.dispatch(new GetVendors({}));
  }

  getProductPlans() {
    this.store.dispatch(new GetProductPlans({}));
  }

  incrementRate() {
    const currentRate = this.form.get("stock")?.value || 0;
    this.form.get("stock")?.setValue(currentRate + 1);
  }

  decrementRate() {
    const currentStock = this.form.get("stock")?.value || 0;
    if (currentStock > 0) {
      this.form.get("stock")?.setValue(currentStock - 1);
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
      action = new UpdateProduct(payload, this.id);
    }

    if (this.type === "create") {
      action = new CreateProduct(payload);
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
                ? "Product updated successfully"
                : "Product created successfully";
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
