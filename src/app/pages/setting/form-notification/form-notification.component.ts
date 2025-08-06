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
  CreateNotificationConfiguration,
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
  selector: "app-form-notification",
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
  templateUrl: "./form-notification.component.html",
  styleUrl: "./form-notification.component.scss",
  standalone:true
})
export class FormNotificationComponent {
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
      sms_sender: new FormControl("", [Validators.required]),
      sms_channel: new FormControl("", [Validators.required]),
      sms_api_key: new FormControl("", [Validators.required]),
      sms_price_per_unit: new FormControl("", [Validators.required]),
      sms_length_per_unit: new FormControl("", [Validators.required]),
      sms_username: new FormControl("", [Validators.required]),
      sms_password: new FormControl("", [Validators.required]),
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
        .subscribe((notification: any) => {
          console.log("Notification ::::::::", notification);
          if (notification) {
            this.id = notification.id;
            // let patchData: any = {
            //   cooperative_name: coop.cooperative_name,
            //   cooperative_initial: coop.cooperative_initial,
            //   country: parseInt(coop.country), // Ensure string type
            //   state: parseInt(coop.state),
            //   city: parseInt(coop.city),
            //   address_line: coop.address_line,
            //   bankName: coop.bankName,
            //   accountName: coop.accountName,
            //   accountNumber: coop.accountNumber,
            // };
            // this.form.patchValue(patchData);
          }
        });
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
      action = new CreateNotificationConfiguration(payload);
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
                ? "Notification Configuration updated successfully"
                : "Notification Configuration created successfully";
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
