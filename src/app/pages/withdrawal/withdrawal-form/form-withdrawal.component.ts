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
  NgbDate,
  NgbDateParserFormatter,
  NgbDateStruct,
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
  take,
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
import {
  Product,
  VariationCombination,
} from "../../../shared/interface/product.interface";
import { MediaConfig, mediaConfig } from "../../../shared/data/media-config";
import { Editor, NgxEditorModule } from "ngx-editor";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonModule, DOCUMENT, isPlatformBrowser } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { FormFieldsComponent } from "../../../shared/components/ui/form-fields/form-fields.component";
import { ButtonComponent } from "../../../shared/components/ui/button/button.component";
import { NavService } from "src/app/shared/services/nav.service";
import { Sidebar } from "src/app/shared/interface/sidebar.interface";
import { RouterModule } from "@angular/router";
import { SavingsState } from "src/app/shared/store/state/savings.state";
import {
  CreateWithdrawal,
  EditWithdrawal,
  SetLoadingState,
  UpdateWithdrawal,
} from "src/app/shared/store/action/withdrawal.action";
import { GetFilteredMembers } from "src/app/shared/store/action/withdrawal.action";
import { appConfig } from "src/app/core/config/config";
import { NotificationService } from "src/app/shared/services/notification.service";
import { WithdrawalState } from "src/app/shared/store/state/withdrawal.state";

function convertToNgbDate(date: NgbDateStruct): NgbDate {
  return new NgbDate(date.year, date.month, date.day);
}

@Component({
  selector: "app-form-withdrawal",
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
  templateUrl: "./form-withdrawal.component.html",
  styleUrl: "./form-withdrawal.component.scss",
})
export class FormWithdrawalComponent {
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

  member$: Observable<any> = inject(Store).select(
    WithdrawalState.member
  ) as Observable<any>;

  public attribute$: Observable<Select2Data>;
  public tabError: string[] | null = [];
  public form: FormGroup;
  public id: number;
  public selectedCategories: number[] = [];
  public selectedTags: number[] = [];
  public variationCombinations: VariationCombination[] = [];
  public retrieveVariants: boolean = false;
  public variantCount: number = 0;
  public fromDate: NgbDate | null;
  public toDate: NgbDate | null;
  public hoveredDate: NgbDate | null = null;
  public collectionProduct: Select2Data;
  public product: Product;
  private destroy$ = new Subject<void>();
  public mediaConfig: MediaConfig = mediaConfig;
  public editor: Editor;
  public selectedMember: any = null;
  public html = "";
  public isCodeEditor = true;
  public years: Select2Data;
  public accountFrom: Select2Data = [
    {
      value: "1",
      label: "Wallet",
    },
    {
      value: "2",
      label: "Savings",
    },
  ];

  public months: Select2Data = [
    {
      value: 1,
      label: "January",
    },
    {
      value: 2,
      label: "February",
    },
    {
      value: 3,
      label: "March",
    },
    {
      value: 4,
      label: "April",
    },
    {
      value: 5,
      label: "May",
    },
    {
      value: 6,
      label: "June",
    },
    {
      value: 7,
      label: "July",
    },
    {
      value: 8,
      label: "August",
    },
    {
      value: 9,
      label: "September",
    },
    {
      value: 10,
      label: "October",
    },
    {
      value: 11,
      label: "November",
    },
    {
      value: 12,
      label: "December",
    },
  ];

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

  public deductionSources: Select2Data = [
    {
      value: "2",
      label: "Cash",
    },
  ];

  public isBrowser: boolean;
  old_amount: any;
  wallet_trx_history_id: any;

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
      user_id: new FormControl("", [Validators.required]),
      from_account: new FormControl("", [Validators.required]),
      amount: new FormControl("", [Validators.required]),
      payment_method: new FormControl("", [Validators.required]),
      currency: new FormControl("", [Validators.required]),
      narration: new FormControl(""),
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

  closeSearch() {
    this.navServices.search = false;
  }

  selectMember(member: any) {
    this.selectedMember = member;
    this.text = member.title; // Display the name in the input
    this.form.controls["user_id"].setValue(member.id); // Set the ID as form value
    this.removeFix(); // Close the dropdown
  }

  openDropDown(text: string) {
    text && (this.searchResult = !this.searchResult);
    var element = document.getElementsByTagName("body")[0];
    element.classList.toggle("overlay-search");
  }

  searchTerm(term?: string) {
    if (term) {
      this.addFix();
      this.store
        .dispatch(new GetFilteredMembers({ search: term }))
        .subscribe(() => {
          this.member$.pipe(take(1)).subscribe((response: any) => {
            if (response) {
              this.items = response.map((member: any) => ({
                id: member.value,
                title: member.label,
                type: "link",
                path: "#",
                rawData: member, // Store original data if needed
              }));
              this.checkSearchResultEmpty(this.items);
            } else {
              this.items = [];
              this.checkSearchResultEmpty([]);
            }
          });
        });
    } else {
      this.removeFix();
      return (this.menuItems = []);
    }
    return this.menuItems;
  }

  checkSearchResultEmpty(items: Sidebar[]) {
    if (!items.length) this.searchResultEmpty = true;
    else this.searchResultEmpty = false;
  }

  addFix() {
    this.searchResult = true;
    document.getElementsByTagName("body")[0].classList.add("overlay-search");
  }

  removeFix() {
    this.searchResult = false;
    // this.text = "";
    document.getElementsByTagName("body")[0].classList.remove("overlay-search");
  }

  clickOutside(): void {
    this.searchResult = false;
  }

  ngOnInit() {
    this.years = this.generateYearOptions();
    if (this.isBrowser) {
      this.editor = new Editor();
    }
    this.route.params
      .pipe(
        switchMap((params) => {
          if (!params["id"]) return of();
          return this.store
            .dispatch(new EditWithdrawal(params["id"]))
            .pipe(
              mergeMap(() =>
                this.store.select(WithdrawalState.selectedWithdrawal)
              )
            );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((withdrawal) => {
        if (withdrawal) {
          console.log("Withdrawal ::::::::::::", withdrawal);
          this.id = withdrawal.id;
          let patchData: any = {
            user_id: withdrawal.user_id,
            from_account: withdrawal.withdraw_from,
            amount: withdrawal.amount,
            payment_method: withdrawal?.payment_method,
            currency: withdrawal.currency,
          };

          if (withdrawal.full_name) {
            this.text = withdrawal?.full_name;
          }
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
      action = new UpdateWithdrawal(
        {
          ...payload,
        },
        this.id
      );
    }

    if (this.type === "create") {
      action = new CreateWithdrawal(payload);
    }

    this.store
      .dispatch(action)
      .pipe(
        finalize(() => this.store.dispatch(new SetLoadingState(false))),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (res: any) => {
          console.log("Response :::::", res);
          const response = res?.withdrawal?.response;
          const successStatus =
            this.type === "edit"
              ? appConfig.statusCode.ok
              : appConfig.statusCode.created;
          if (response?.status === successStatus) {
            const successMessage =
              this.type === "edit"
                ? "Withdrawal updated successfully"
                : "Withdrawal created successfully";
            this.notificationService.showSuccess(
              response?.message || successMessage
            );
            this.router.navigateByUrl("/withdrawal");
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
