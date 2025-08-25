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
import {
  CreateLoan,
  EditLoan,
  GetFilteredMembers,
  SetLoadingState,
  UpdateLoan,
  GetLoanType,
} from "src/app/shared/store/action/loan.action";
import { appConfig } from "src/app/core/config/config";
import { NotificationService } from "src/app/shared/services/notification.service";
import { LoanState } from "src/app/shared/store/state/loan.state";
import { GLOBALF } from "src/app/core/utils/my_library";

function convertToNgbDate(date: NgbDateStruct): NgbDate {
  return new NgbDate(date.year, date.month, date.day);
}

@Component({
  selector: "app-form-loan",
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
  templateUrl: "./form-loan.component.html",
  styleUrl: "./form-loan.component.scss",
  standalone:true
})
export class FormLoanComponent {
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
    LoanState.member
  ) as Observable<any>;
  loan_type$: Observable<any> = inject(Store).select(
    LoanState.loan_type
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
  public sharesType: Select2Data = [
    {
      value: "Savings",
      label: "Savings",
    },
    {
      value: "Fixed",
      label: "Fixed",
    },
    {
      value: "Special",
      label: "Special",
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

  public deductionSources: Select2Data = [
    {
      value: "1",
      label: "Cash",
    },
    {
      value: "2",
      label: "Other",
    },
  ];

  public isBrowser: boolean;
  old_amount: any;
  old_interest: any;
  old_duration: any;
  searchState: boolean;

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
      amount: new FormControl("", [Validators.required]),
      loan_offer_id: new FormControl("", [Validators.required]),
      duration: new FormControl("", [Validators.required]),
      interest: new FormControl("", [Validators.required]),
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

    // Dispatch action to get loan types and wait for them to load
    this.store
      .dispatch(new GetLoanType({}))
      .pipe(
        take(1),
        switchMap(() => this.loan_type$),
        takeUntil(this.destroy$)
      )
      .subscribe((loanTypes) => {
        // Now that loan types are loaded, handle the route params
        this.route.params
          .pipe(
            switchMap((params) => {
              if (!params["id"]) return of(null);
              return this.store
                .dispatch(new EditLoan(params["id"]))
                .pipe(
                  mergeMap(() => this.store.select(LoanState.selectedLoan))
                );
            }),
            takeUntil(this.destroy$)
          )
          .subscribe((loan) => {
            if (loan) {
              console.log("Loan ::::", loan);
              this.id = loan.id;
              this.old_amount = loan.amount;
              this.old_interest = loan.interest;
              this.old_duration = loan.duration;
              let patchData: any = {
                user_id: loan.user_id,
                loan_offer_id: loan.loan_offer_id,
                amount: loan.amount,
                duration: loan.duration,
                interest: loan.interest,
              };

              if (loan.full_name) {
                this.text = loan?.full_name;
              }

              // Patch the form values after loan types are loaded
              this.form.patchValue(patchData);

              if (this.type === "edit") {
                this.form.get("user_id")?.disable();
                this.form.get("loan_offer_id")?.disable();
                this.form.get("duration")?.disable();
                this.form.get("interest")?.disable();
                this.searchState = true;
              }
            }
          });
      });

    // Set up the loan_offer_id change listener
    this.form
      .get("loan_offer_id")
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((selectedLoanTypeId) => {
        if (selectedLoanTypeId) {
          this.loan_type$.pipe(take(1)).subscribe((loanTypes) => {
            const selectedLoanType = loanTypes.find(
              (loan: any) => loan?.value == selectedLoanTypeId
            );
            if (selectedLoanType && selectedLoanType.interest) {
              this.form
                .get("interest")
                .setValue(selectedLoanType.interest, { emitEvent: false });
            }
          });
        }
      });
  }

  submit() {
    this.form.markAllAsTouched();
    if (!this.form.valid) {
      return;
    }

    if (this.type === "edit") {
      this.form.get("user_id")?.enable();
      this.form.get("loan_offer_id")?.enable();
      this.form.get("duration")?.enable();
      this.form.get("interest")?.enable();
    }

    let payload = { ...this.form.value, guarantors: [] };
    console.log("Payload ::::::::::", payload);
    this.store.dispatch(new SetLoadingState(true));
    let action: any;

    if (this.type == "edit" && this.id) {
      action = new UpdateLoan(
        {
          ...payload,
          old_amount: this.old_amount,
          old_interest: this.old_interest,
          old_duration: this.old_duration,
        },
        this.id
      );
    }

    if (this.type === "create") {
      action = new CreateLoan(payload);
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
          const response = res?.loan?.response;
          const successStatus =
            this.type === "edit"
              ? appConfig.statusCode.ok
              : appConfig.statusCode.created;
          if (response?.status === successStatus) {
            const successMessage =
              this.type === "edit"
                ? "Shares updated successfully"
                : "Savings created successfully";
            this.notificationService.showSuccess(
              response?.message || successMessage
            );
            this.router.navigateByUrl("/loan/requested-loans");
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

  onAmountInput(event: Event, controlName: string) {
    GLOBALF.handleAmountInput(event, this.form, controlName);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.form.reset();
    this.renderer.removeClass(this.document.body, "loader-none");
  }
}
