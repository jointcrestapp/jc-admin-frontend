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
import { Select2Module } from "ng-select2-component";
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
  CreateLoanApplicationConfiguration,
  SetLoadingState,
} from "./../../../shared/store/action/settings.action";
import { SettingsState } from "../../../shared/store/state/settings.state";
import {
  CreateMember,
  EditMember,
  UpdateMember,
} from "../../../shared/store/action/member.action";
import { MemberState } from "../../../shared/store/state/member.state";
import { TranslateModule } from "@ngx-translate/core";
import { FormFieldsComponent } from "../../../shared/components/ui/form-fields/form-fields.component";
import { CommonModule, isPlatformBrowser } from "@angular/common";
import { ButtonComponent } from "../../../shared/components/ui/button/button.component";
import { LoaderComponent } from "../../../shared/components/loader/loader.component";
import { appConfig } from "src/app/core/config/config";
import { NotificationService } from "src/app/shared/services/notification.service";

@Component({
  selector: "app-form-loan",
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
  templateUrl: "./form-loan.component.html",
  styleUrl: "./form-loan.component.scss",
})
export class FormLoanComponent {
  public store = inject(Store);
  public form: FormGroup;
  public id: number;
  private destroy$ = new Subject<void>();
  public isBrowser: boolean;
  public tabError: string[] | null = [];

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
      processing_fee: new FormControl("", [Validators.required]),
      loan_requestable: new FormControl("", [Validators.required]),
      approval_level: new FormControl("", [Validators.required]),
      repayment: new FormControl("", [Validators.required]),
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
              accountName: coop.accountName,
              accountNumber: coop.accountNumber,
            };
            this.form.patchValue(patchData);
          }
        });
    }
  }

  handleIncrement(field: string) {
    console.log("Field ::::::::::::::::", field);
    if (field === "approval level") {
      const currentApprovalLevel = this.form.get("approval_level")?.value || 0;
      this.form.get("approval_level")?.setValue(currentApprovalLevel + 1);
    } else if (field === "repayment") {
      const currentRepayment = this.form.get("repayment")?.value || 0;
      this.form.get("repayment")?.setValue(currentRepayment + 1);
    }
  }

  handleDecrement(field: string) {
    const currentApprovalLevel = this.form.get("approval_level")?.value || 0;
    const currentRepayment = this.form.get("repayment")?.value || 0;
    if (field === "approval level" && currentApprovalLevel > 0) {
      this.form.get("approval_level")?.setValue(currentApprovalLevel - 1);
    } else if (field === "repayment" && currentRepayment > 0) {
      this.form.get("repayment")?.setValue(currentRepayment - 1);
    }
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
      action = new CreateLoanApplicationConfiguration(payload);
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
                ? "Loan Application Configuration updated successfully"
                : "Loan Application Configuration created successfully";
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
