import {
  Component,
  Inject,
  inject,
  Input,
  PLATFORM_ID,
  ViewChild,
} from "@angular/core";
import {
  NgbCalendar,
  NgbDate,
  NgbDateParserFormatter,
  NgbModule,
  NgbRatingConfig,
  NgbNav,
} from "@ng-bootstrap/ng-bootstrap";
import { Select, Store } from "@ngxs/store";
import { RoleState } from "../../../shared/store/state/role.state";
import {
  Observable,
  Subject,
  catchError,
  distinctUntilChanged,
  filter,
  finalize,
  forkJoin,
  mergeMap,
  of,
  switchMap,
  take,
  takeUntil,
  tap,
} from "rxjs";
import { Select2Data, Select2Module } from "ng-select2-component";
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { countryCodes } from "../../../shared/data/country-code";
import { ActivatedRoute, Router } from "@angular/router";
import { CustomValidators } from "../../../shared/validator/password-match";
import {
  CreateMember,
  EditMember,
  SetLoadingState,
  UpdateMember,
  GetBanks,
  GetBankCode,
  GetBankKYC,
} from "../../../shared/store/action/member.action";
import { MemberState } from "../../../shared/store/state/member.state";
import { TranslateModule } from "@ngx-translate/core";
import { FormFieldsComponent } from "../../../shared/components/ui/form-fields/form-fields.component";
import { CommonModule, isPlatformBrowser } from "@angular/common";
import { ButtonComponent } from "../../../shared/components/ui/button/button.component";
import { LoaderComponent } from "../../../shared/components/loader/loader.component";
import { appConfig } from "src/app/core/config/config";
import { NotificationService } from "src/app/shared/services/notification.service";
import { CountryState } from "src/app/shared/store/state/country.state";
import { GetStates } from "src/app/shared/store/action/country.action";
import { GetRoles } from "src/app/shared/store/action/role.action";
import {
  genders,
  marital_status,
  means_of_identification,
  banks,
} from "src/app/shared/data/common";
import { GLOBALF } from "src/app/core/utils/my_library";

@Component({
  selector: "app-form-member",
  imports: [
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    Select2Module,
    CommonModule,
    ButtonComponent,
    FormFieldsComponent,
    LoaderComponent,
  ],
  templateUrl: "./form-member.component.html",
  styleUrl: "./form-member.component.scss",
})
export class FormMemberComponent {
  public store = inject(Store);
  public form: FormGroup;
  public id: number;
  public codes = countryCodes;
  public gender = genders;
  public marital_status = marital_status;
  public means_of_identification = means_of_identification;
  public hoveredDate: NgbDate | null = null;
  public dateOfBirth: NgbDate | null;
  public minDate: NgbDate;
  public maxDate: NgbDate;
  private destroy$ = new Subject<void>();
  public isBrowser: boolean;
  public active = "general";
  public tabError: string[] | null = [];
  public banks = banks;
  public reg_date_state = true;

  countries$: Observable<Select2Data> = inject(Store).select(
    CountryState.countries
  ) as Observable<Select2Data>;
  states$: Observable<Select2Data> = inject(Store).select(
    CountryState.states
  ) as Observable<Select2Data>;
  banks$: Observable<Select2Data> = inject(Store).select(
    MemberState.banks
  ) as Observable<Select2Data>;
  bank_code$: Observable<any> = inject(Store).select(
    MemberState.bank_code
  ) as Observable<any>;
  logo$: Observable<any> = inject(Store).select(
    MemberState.logo
  ) as Observable<any>;
  account_details$: Observable<any> = inject(Store).select(
    MemberState.account_details
  ) as Observable<any>;
  role$: Observable<Select2Data> = this.store.select(RoleState.roles);
  isLoading$: Observable<boolean> = this.store.select(MemberState.isLoading);
  kycDetails: any = {
    name: "Farouk Bello",
    bank_name: "Moniepoint Micro Finance",
  };

  @Input() type: string;
  @ViewChild("nav") nav: NgbNav;

  constructor(
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter,
    config: NgbRatingConfig,
    private router: Router,
    private formBuilder: FormBuilder,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.minDate = new NgbDate(1960, 1, 1);
    this.maxDate = this.calendar.getToday();

    this.form = this.formBuilder.group(
      {
        first_name: new FormControl("", [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
          Validators.pattern(appConfig.pattern.NAME),
        ]),

        last_name: new FormControl("", [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
          Validators.pattern(appConfig.pattern.NAME),
        ]),
        email: new FormControl("", [
          Validators.required,
          Validators.pattern(appConfig.pattern.EMAIL),
        ]),

        phone: new FormControl("", [
          Validators.required,
          Validators.pattern(appConfig.pattern.SIMPLE_PHONE_NO),
        ]),
        dial_code: new FormControl("234", [Validators.required]),
        country: new FormControl("", [Validators.required]),
        state: new FormControl("", [Validators.required]),
        city: new FormControl("", [Validators.required]),
        dob: new FormControl("", [
          Validators.required,
          this.validateDob.bind(this),
        ]),
        gender: new FormControl("", [Validators.required]),
        // marital_status: new FormControl("", [Validators.required]),
        address_line1: new FormControl("", [Validators.required]),
        means_of_identification: new FormControl("", [Validators.required]),
        account_type: new FormControl("", [Validators.required]),
        cooperativeDetails: this.formBuilder.group({
          registration_date: new FormControl(
            { value: GLOBALF.formatDate(new Date()), disabled: true },
            [Validators.required]
          ),
          registration_fee: new FormControl(1000, [Validators.required]),
          savings_amount: new FormControl(""),
        }),
        bankDetails: this.formBuilder.group({
          accountName: new FormControl("", [Validators.required]),
          accountNumber: new FormControl("", [Validators.required]),
          bankName: new FormControl("", [Validators.required]),
          bankCode: new FormControl(""),
          bankLogo: new FormControl(""),
        }),
        nextOfKins: this.formBuilder.array([]),
        password: new FormControl(""),
        password_confirmation: new FormControl(""),
        status: new FormControl(1),
      },
      {
        validator: CustomValidators.MatchValidator(
          "password",
          "password_confirmation"
        ),
      }
    );
  }

  get passwordMatchError() {
    return (
      this.form.getError("mismatch") &&
      this.form.get("password_confirmation")?.touched
    );
  }

  ngOnInit() {
    if (this.type === "create") {
      this.form.get("password")?.setValidators([Validators.required]);
      this.form
        .get("password_confirmation")
        ?.setValidators([Validators.required]);

      // Update the form controls to apply the new validators
      this.form.get("password")?.updateValueAndValidity();
      this.form.get("password_confirmation")?.updateValueAndValidity();
    }
    // Check if there's any state
    if (this.type === "edit") {
      this.route.params
        .pipe(
          switchMap((params) => {
            const id = +params["id"];
            if (!id) return of(null);
            return this.store
              .dispatch(new EditMember(id))
              .pipe(
                switchMap(() =>
                  this.store.select(MemberState.selectedMember).pipe(take(1))
                )
              );
          }),
          takeUntil(this.destroy$)
        )
        .subscribe((member: any) => {
          console.log("Member ::::::::", member);
          if (member) {
            this.id = member.id;
            let patchData: any = {
              first_name: member.first_name,
              last_name: member.last_name,
              email: member.email,
              phone: member.phone,
              dial_code: member.dial_code,
              status: member.is_activated == 1 ? 1 : 0,
              country: parseInt(member.country), // Ensure string type
              state: parseInt(member.state),
              city: parseInt(member.city),
              gender: member.gender,
              // marital_status: member.marital_status,
              address_line1: member.address_line1,
              means_of_identification: member.means_of_identification,
              account_type: parseInt(member?.account_type),
            };

            if (member?.activation_history) {
              patchData.cooperativeDetails = {
                registration_fee: member?.activation_history?.amount,
              };
            }

            if (member?.bank_detail) {
              patchData.bankDetails = {
                accountName: member?.bank_detail?.accountName,
                accountNumber: member?.bank_detail?.accountNumber,
                bankName: member?.bank_detail?.bankName,
                bankCode: member?.bank_detail?.BankCode,
              };
            }

            if (member?.activation_history?.createdAt) {
              const regDate = new Date(member?.activation_history?.createdAt);
              patchData.cooperativeDetails.registration_date =
                this.formatter.format(
                  new NgbDate(
                    regDate.getFullYear(),
                    regDate.getMonth() + 1,
                    regDate.getDate()
                  )
                );
            }

            if (member.dob) {
              const dobDate = new Date(member.dob);
              patchData.dob = this.formatter.format(
                new NgbDate(
                  dobDate.getFullYear(),
                  dobDate.getMonth() + 1,
                  dobDate.getDate()
                )
              );
            }

            this.form.patchValue(patchData);

            // Handle next of kin if exists
            if (member?.noks && member?.noks.length) {
              this.nextOfKins.clear();
              member?.noks.forEach((kin: any) => {
                this.nextOfKins.push(
                  this.formBuilder.group({
                    first_name: [kin.first_name],
                    last_name: [kin.last_name],
                    email: [kin.email],
                  })
                );
              });
            }
          }
        });
    }
    // Listen for changes on 'fname' and capitalize the first letter
    this.form.controls["first_name"].valueChanges.subscribe((value) => {
      this.capitalizeFirstLetter("first_name", value);
    });

    // Listen for changes on 'lname' and capitalize the first letter
    this.form.controls["last_name"].valueChanges.subscribe((value) => {
      this.capitalizeFirstLetter("last_name", value);
    });

    this.form
      .get("country")
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((countryId) => {
        if (countryId) {
          console.log("Country changed to:", countryId);
          this.handleCountrySelection(countryId);

          // Clear the state field when country changes
          this.form.get("state")?.reset();
          this.form.get("city")?.reset();

          // Optional: Mark the state field as untouched if you want to reset validation state
          this.form.get("state")?.markAsUntouched();
          this.form.get("city")?.markAsUntouched();
        } else {
          // If country is cleared, also reset state
          this.form.get("state")?.reset();
          this.form.get("city")?.reset();
        }
      });

    this.form
      .get("bankDetails.bankName")
      ?.valueChanges.pipe(takeUntil(this.destroy$), distinctUntilChanged())
      .subscribe((id) => {
        if (id) {
          console.log("Bank changed to:", id);
          this.handleBankSelection(id);
          this.form.get("bankDetails.bankCode")?.reset();
          this.form.get("bankDetails.bankCode")?.markAsUntouched();
          this.form.get("bankDetails.accountNumber")?.reset();
          this.form.get("bankDetails.accountNumber")?.markAsUntouched();
          this.form.get("bankDetails.accountName")?.reset();
          this.form.get("bankDetails.accountName")?.markAsUntouched();
        } else {
          this.form.get("bankDetails.bankCode")?.reset();
          this.form.get("bankDetails.accountNumber")?.reset();
          this.form.get("bankDetails.accountName")?.reset();
        }
      });

    this.form
      .get("bankDetails.accountNumber")
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((accountNumber: any) => {
        if (accountNumber.length >= 10) {
          this.bank_code$
            .pipe(takeUntil(this.destroy$))
            .subscribe((bankCode: any) => {
              if (bankCode) {
                this.handleBankKYC({
                  account_number: accountNumber,
                  bank_code: bankCode,
                });
                this.account_details$
                  .pipe(takeUntil(this.destroy$))
                  .subscribe((accountDetails: any) => {
                    if (accountDetails) {
                      this.form
                        .get("bankDetails.accountName")
                        ?.setValue(accountDetails?.data?.account_name);
                    }
                  });
                // this.form
                //   .get("bankDetails.accountName")
                //   ?.setValue(this.kycDetails.name);
              }
            });
        }
      });

    this.bank_code$
      .pipe(takeUntil(this.destroy$))
      .subscribe((bankCode: any) => {
        if (bankCode) {
          this.form.get("bankDetails.bankCode")?.setValue(bankCode);
        }
      });

    this.logo$.pipe(takeUntil(this.destroy$)).subscribe((logo: any) => {
      this.form.get("bankDetails.bankLogo")?.setValue(logo);
    });

    this.store.dispatch(new GetRoles({}));
    this.store.dispatch(new GetBanks());

    this.role$.pipe(takeUntil(this.destroy$)).subscribe((roles) => {});
  }

  // Function to capitalize the first letter
  capitalizeFirstLetter(controlName: string, value: string) {
    if (value && value.length > 0) {
      const capitalized =
        value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
      // Only update the form control value if it's different
      if (this.form.get(controlName)?.value !== capitalized) {
        this.form.get(controlName)?.setValue(capitalized, { emitEvent: false });
      }
    }
  }

  // Add these methods to your component
  getFormattedDate(): string {
    const dob = this.form.controls["dob"].value;
    if (!dob) return "";

    // Handle both string and NgbDate formats
    if (typeof dob === "string") {
      return dob; // Assuming it's already formatted
    } else if (dob.year && dob.month && dob.day) {
      return `${dob.year}-${dob.month.toString().padStart(2, "0")}-${dob.day
        .toString()
        .padStart(2, "0")}`;
    }
    return "";
  }

  getStartDate(): NgbDate | { year: number; month: number } {
    const dob = this.form.controls["dob"].value;
    if (dob && dob.year && dob.month && dob.day) {
      return dob;
    }
    return { year: new Date().getFullYear() - 18, month: 1 };
  }

  onDateSelection(date: NgbDate) {
    this.form.controls["dob"].setValue(this.formatter.format(date));
    this.form.controls["dob"].markAsTouched();
  }

  isSelected(date: NgbDate): boolean {
    const dob = this.form.controls["dob"].value;
    return (
      dob &&
      dob.year === date.year &&
      dob.month === date.month &&
      dob.day === date.day
    );
  }

  clearDob() {
    this.form.controls["dob"].reset();
    this.form.controls["dob"].markAsTouched();
  }

  get nextOfKins(): FormArray {
    return this.form.get("nextOfKins") as FormArray;
  }

  createNextOfKin(): FormGroup {
    return this.formBuilder.group({
      first_name: [""],
      last_name: [""],
      email: [""],
    });
  }

  addNextOfKin(): void {
    this.nextOfKins.push(this.createNextOfKin());
  }

  removeNextOfKin(index: number): void {
    this.nextOfKins.removeAt(index);
  }

  // Custom date validator
  private validateDob(control: FormControl): { [key: string]: any } | null {
    const value = control.value;
    if (!value) return null;

    // Handle both string and NgbDate formats
    if (typeof value === "string") {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return { invalidDate: true };
      }
    } else if (!value.year || !value.month || !value.day) {
      return { invalidDate: true };
    }

    return null;
  }

  handleCountrySelection(id: number) {
    this.store.dispatch(new GetStates(id));
  }

  handleBankSelection(id: number) {
    this.store.dispatch(new GetBankCode(id));
  }

  handleBankKYC(data: any) {
    this.store.dispatch(new GetBankKYC(data));
  }

  private logInvalidControl(
    controlName: string,
    control: AbstractControl
  ): void {
    const errors = control.errors || {};
    const errorMessages: string[] = [];

    if (errors["required"]) {
      errorMessages.push("Field is required");
    }
    if (errors["minlength"]) {
      errorMessages.push(
        `Minimum length ${errors["minlength"].requiredLength}`
      );
    }
    if (errors["maxlength"]) {
      errorMessages.push(
        `Maximum length ${errors["maxlength"].requiredLength}`
      );
    }
    if (errors["pattern"]) {
      errorMessages.push(
        `Invalid format (expected pattern: ${errors["pattern"].requiredPattern})`
      );
    }
    if (errors["email"]) {
      errorMessages.push("Invalid email format");
    }
    if (errors["mismatch"]) {
      errorMessages.push("Passwords do not match");
    }

    console.groupCollapsed(
      `%c${controlName}: ${errorMessages.join(", ")}`,
      "color: red;"
    );
    console.log("Current value:", control.value);
    console.log("Validation errors:", errors);
    console.groupEnd();
  }

  submit() {
    this.form.markAllAsTouched();
    if (!this.form.valid) {
      console.log(
        "%c=== FORM VALIDATION ERRORS ===",
        "color: red; font-weight: bold;"
      );

      // Check main form controls
      Object.keys(this.form.controls).forEach((controlName) => {
        const control = this.form.get(controlName);

        if (control?.invalid) {
          this.logInvalidControl(controlName, control);
        }

        // Handle nested form groups - type-safe check
        if (control instanceof FormGroup) {
          Object.keys((control as FormGroup).controls).forEach((nestedName) => {
            const nestedControl = (control as FormGroup).get(nestedName);
            if (nestedControl?.invalid) {
              this.logInvalidControl(
                `${controlName}.${nestedName}`,
                nestedControl
              );
            }
          });
        }

        // Handle form arrays (nextOfKins) - type-safe check
        if (control instanceof FormArray) {
          (control as FormArray).controls.forEach((arrayControl, index) => {
            if (arrayControl.invalid) {
              console.group(`%cnextOfKins[${index}]`, "color: orange;");
              if (arrayControl instanceof FormGroup) {
                Object.keys((arrayControl as FormGroup).controls).forEach(
                  (kinField) => {
                    const kinControl = (arrayControl as FormGroup).get(
                      kinField
                    );
                    if (kinControl?.invalid) {
                      this.logInvalidControl(kinField, kinControl);
                    }
                  }
                );
              }
              console.groupEnd();
            }
          });
        }
      });

      return;
    }

    let payload = { ...this.form.value };
    payload.account_type = appConfig.roles.AGENT;
    payload.is_activated = payload.status ? 1 : 0;
    payload.is_deleted = 0;

    delete payload.password_confirmation;

    // Dispatch the loading action
    this.store.dispatch(new SetLoadingState(true));

    let action: any;

    if (this.type == "edit" && this.id) {
      // Remove password fields for edit
      this.form.removeControl("password");
      this.form.removeControl("password_confirmation");
      payload.status = payload.status ? 1 : 0;

      // Get the current member data from store
      const currentMember = this.store.selectSnapshot(
        MemberState.selectedMember
      );

      // Add IDs to related data
      if (currentMember?.bank_detail?.id) {
        payload.bankDetails.id = currentMember.bank_detail.id;
        payload.bankDetails.user_id = this.id;
      }

      if (currentMember?.activation_history?.id) {
        payload.cooperativeDetails.id = currentMember.activation_history.id;
        payload.cooperativeDetails.user_id = this.id;
      }

      // Add IDs to next of kin records
      if (currentMember?.noks && currentMember.noks.length > 0) {
        payload.nextOfKins = payload.nextOfKins.map(
          (kin: any, index: number) => ({
            ...kin,
            id: currentMember.noks[index]?.id || null,
            user_id: this.id,
          })
        );
      }

      action = new UpdateMember(payload, this.id);
    }

    if (this.type === "create") {
      payload.member_id = GLOBALF.genrateMemberId();
      action = new CreateMember(payload);
    }

    this.store
      .dispatch(action)
      .pipe(
        finalize(() => this.store.dispatch(new SetLoadingState(false))),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (res: any) => {
          const response = res?.member?.response;
          const successStatus =
            this.type === "edit"
              ? appConfig.statusCode.ok
              : appConfig.statusCode.created;
          if (response?.status === successStatus) {
            const successMessage =
              this.type === "edit"
                ? "Member updated successfully"
                : "Member created successfully";
            this.notificationService.showSuccess(
              response?.message || successMessage
            );
            this.router.navigateByUrl("/registration");
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
  }
}
