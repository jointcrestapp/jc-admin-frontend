import {
  Component,
  Inject,
  inject,
  Input,
  PLATFORM_ID,
  ViewChild,
} from "@angular/core";
import {
  NgbDateParserFormatter,
  NgbModule,
  NgbNav,
} from "@ng-bootstrap/ng-bootstrap";
import { Store } from "@ngxs/store";
import {
  Observable,
  Subject,
  finalize,
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
import { ActivatedRoute, Router } from "@angular/router";
import {
  CreateCooperative,
  SetLoadingState,
} from "./../../../shared/store/action/settings.action";
import {
  CreateMember,
  EditMember,
  UpdateMember,
  GetBanks,
} from "../../../shared/store/action/member.action";
import { SettingsState } from "../../../shared/store/state/settings.state";
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
import { banks } from "src/app/shared/data/common";

@Component({
  selector: "app-form-basic",
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
  templateUrl: "./form-basic.component.html",
  styleUrl: "./form-basic.component.scss",
})
export class FormBasicComponent {
  public store = inject(Store);
  public form: FormGroup;
  public id: number;
  private destroy$ = new Subject<void>();
  public isBrowser: boolean;
  public tabError: string[] | null = [];
  public banks = banks;

  countries$: Observable<Select2Data> = inject(Store).select(
    CountryState.countries
  ) as Observable<Select2Data>;
  states$: Observable<Select2Data> = inject(Store).select(
    CountryState.states
  ) as Observable<Select2Data>;
  banks$: Observable<Select2Data> = inject(Store).select(
    MemberState.banks
  ) as Observable<Select2Data>;
  isLoading$: Observable<boolean> = this.store.select(SettingsState.isLoading);
  @Input() type: string;
  @ViewChild("nav") nav: NgbNav;

  constructor(
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    public formatter: NgbDateParserFormatter,
    private router: Router,
    private formBuilder: FormBuilder,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    this.form = this.formBuilder.group({
      cooperative_name: new FormControl("", [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        Validators.pattern(appConfig.pattern.NAME),
      ]),

      cooperative_initial: new FormControl("", [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        Validators.pattern(appConfig.pattern.NAME),
      ]),
      country: new FormControl("", [Validators.required]),
      state: new FormControl("", [Validators.required]),
      city: new FormControl("", [Validators.required]),
      address_line: new FormControl("", [Validators.required]),
      account_name: new FormControl("", [Validators.required]),
      account_number: new FormControl("", [Validators.required]),
      bank_name: new FormControl("", [Validators.required]),
    });
  }

  ngOnInit() {
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
        .subscribe((coop: any) => {
          console.log("Cooperative ::::::::", coop);
          if (coop) {
            this.id = coop.id;
            let patchData: any = {
              cooperative_name: coop.cooperative_name,
              cooperative_initial: coop.cooperative_initial,
              country: parseInt(coop.country), // Ensure string type
              state: parseInt(coop.state),
              city: parseInt(coop.city),
              address_line: coop.address_line,
              bank_name: coop.bank_name,
              account_name: coop.account_name,
              account_number: coop.account_number,
            };
            this.form.patchValue(patchData);
          }
        });
    }
    // Listen for changes on 'fname' and capitalize the first letter
    this.form.controls["cooperative_name"].valueChanges.subscribe((value) => {
      this.capitalizeFirstLetter("cooperative_name", value);
    });

    // Listen for changes on 'lname' and capitalize the first letter
    this.form.controls["cooperative_initial"].valueChanges.subscribe(
      (value) => {
        this.capitalizeFirstLetter("cooperative_initial", value);
      }
    );

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
    this.store.dispatch(new GetBanks());
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

  handleCountrySelection(id: number) {
    this.store.dispatch(new GetStates(id));
  }

  submit() {
    this.form.markAllAsTouched();
    if (!this.form.valid) {
      return;
    }

    let payload = { ...this.form.value };

    // Dispatch the loading action
    this.store.dispatch(new SetLoadingState(true));

    let action: any;

    if (this.type == "edit" && this.id) {
      action = new UpdateMember(payload, this.id);
    }

    if (this.type === "create") {
      action = new CreateCooperative(payload);
    }

    this.store
      .dispatch(action)
      .pipe(
        finalize(() => this.store.dispatch(new SetLoadingState(false))),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (res: any) => {
          const response = res?.settings?.response;
          const successStatus =
            this.type === "edit"
              ? appConfig.statusCode.ok
              : appConfig.statusCode.created;
          if (response?.status === successStatus) {
            this.form.reset();
            this.form.markAsPristine();
            this.form.markAsUntouched();
            const successMessage =
              this.type === "edit"
                ? "Cooperative information updated successfully"
                : "Cooperative information created successfully";
            this.notificationService.showSuccess(
              response?.message || successMessage
            );
            this.router.navigateByUrl("/setting");
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
