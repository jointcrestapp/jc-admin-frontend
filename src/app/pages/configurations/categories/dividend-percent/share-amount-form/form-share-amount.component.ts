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
import { Select2Data, Select2Module } from "ng-select2-component";
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
import { FormFieldsComponent } from "../../../../../shared/components/ui/form-fields/form-fields.component";
import { ButtonComponent } from "../../../../../shared/components/ui/button/button.component";
import { NavService } from "src/app/shared/services/nav.service";
import { Sidebar } from "src/app/shared/interface/sidebar.interface";
import { RouterModule } from "@angular/router";
import { ConfigurationsState } from "src/app/shared/store/state/configurations.state";
import {
  CreateShareAmount,
  EditShareAmount,
  SetLoadingState,
  UpdateShareAmount,
} from "src/app/shared/store/action/configurations.action";
import { appConfig } from "src/app/core/config/config";
import { NotificationService } from "src/app/shared/services/notification.service";

@Component({
  selector: "app-form-share-amount",
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
  templateUrl: "./form-share-amount.component.html",
  styleUrl: "./form-share-amount.component.scss",
})
export class FormShareAmountComponent {
  public searchResult: boolean = false;
  public searchResultEmpty: boolean = false;
  public text: string;
  public open = false;

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

  public currencies: Select2Data = [
    {
      value: "FCFA",
      label: "CFA franc",
    },
    {
      value: "دج",
      label: "Algerian dinar",
    },
    {
      value: "Kz",
      label: "Angolan kwanza",
    },
    {
      value: "P",
      label: "Botswana pula",
    },
    {
      value: "FBu",
      label: "Burundian franc",
    },
    {
      value: "CVE",
      label: "Cape Verdean escudo",
    },
    {
      value: "CF",
      label: "Comorian franc",
    },
    {
      value: "FC",
      label: "Congolese franc",
    },
    {
      value: "Fdj",
      label: "Djiboutian franc",
    },
    {
      value: "E£",
      label: "Egyptian pound",
    },
    {
      value: "Nkf",
      label: "Eritrean nakfa",
    },
    {
      value: "Br",
      label: "Ethiopian birr",
    },
    {
      value: "L",
      label: "Lilangeni",
    },
    {
      value: "D",
      label: "Dalasi",
    },
    {
      value: "GH₵",
      label: "Ghanaian cedi",
    },
    {
      value: "FG",
      label: "Guinean franc",
    },
    {
      value: "KSh",
      label: "Kenyan shilling",
    },
    {
      value: "L",
      label: "Lesotho loti",
    },
    {
      value: "LD$",
      label: "Liberian dollar",
    },
    {
      value: "LD",
      label: "Libyan dinar",
    },
    {
      value: "Ar",
      label: "Malagasy ariary",
    },
    {
      value: "K",
      label: "Malawian kwacha",
    },
    {
      value: "₨",
      label: "Mauritian rupee",
    },
    {
      value: "UM",
      label: "Ouguiya",
    },
    {
      value: "DH",
      label: "Moroccan dirham",
    },
    {
      value: "MT",
      label: "Mozambican metical	",
    },
    {
      value: "N$",
      label: "Namibian dollar",
    },
    {
      value: "₦",
      label: "Nigerian naira",
    },
    {
      value: "R₣",
      label: "Rwandan franc",
    },
    {
      value: "Db",
      label: "São Tomé and Príncipe dobra",
    },
    {
      value: "SR",
      label: "Seychellois rupee",
    },
    {
      value: "Le",
      label: "Sierra Leonean leone",
    },
    {
      value: "Sh.So.",
      label: "Somali shilling",
    },
    {
      value: "R",
      label: "South african rand",
    },
    {
      value: "SS£",
      label: "South Sudanese pound",
    },
    {
      value: "SDG",
      label: "Sudanese pound",
    },
    {
      value: "TSh",
      label: "Tanzanian shilling",
    },
    {
      value: "د.ت",
      label: "Tunisian dinar",
    },
    {
      value: "USh",
      label: "Ugandan shilling",
    },
    {
      value: "$",
      label: "United States Dollar",
    },
  ];

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
      amount: new FormControl("", [Validators.required]),
      currency: new FormControl("", [Validators.required]),
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
            .dispatch(new EditShareAmount(params["id"]))
            .pipe(
              mergeMap(() =>
                this.store.select(ConfigurationsState.selectedShareAmount)
              )
            );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((sa) => {
        if (sa) {
          this.id = sa.id;
          let patchData: any = {
            amount: sa.amount,
            currency: sa.currency,
          };
          this.form.patchValue(patchData);
        }
      });
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
      action = new UpdateShareAmount(payload, this.id);
    }

    if (this.type === "create") {
      action = new CreateShareAmount(payload);
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
                ? "Share Amount updated successfully"
                : "Share Amount created successfully";
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
