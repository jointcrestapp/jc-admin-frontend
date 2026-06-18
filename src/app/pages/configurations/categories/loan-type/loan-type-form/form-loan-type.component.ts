import {
  Component,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  Renderer2,
  SimpleChanges,
} from "@angular/core";
import { Store } from "@ngxs/store";
import { Subject, finalize, takeUntil } from "rxjs";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Editor, NgxEditorModule } from "ngx-editor";
import { Router } from "@angular/router";
import { CommonModule, DOCUMENT, isPlatformBrowser } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { FormFieldsComponent } from "../../../../../shared/components/ui/form-fields/form-fields.component";
import { ButtonComponent } from "../../../../../shared/components/ui/button/button.component";
import { RouterModule } from "@angular/router";
import {
  CreateLoanType,
  SetLoadingState,
  UpdateLoanType,
} from "src/app/shared/store/action/configurations.action";
import { appConfig } from "src/app/core/config/config";
import { NotificationService } from "src/app/shared/services/notification.service";

@Component({
  selector: "app-form-loan-type",
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgxEditorModule,
    FormFieldsComponent,
    ButtonComponent,
  ],
  templateUrl: "./form-loan-type.component.html",
  styleUrl: "./form-loan-type.component.scss",
})
export class FormLoanTypeComponent implements OnInit, OnChanges, OnDestroy {
  @Input() type: string;
  @Input() loanTypeData: any = null;

  public tabError: string[] | null = [];
  public form: FormGroup;
  public id: number;
  public isQuickCash: boolean = false;
  private destroy$ = new Subject<void>();
  public editor: Editor;
  public isBrowser: boolean;

  constructor(
    private store: Store,
    private router: Router,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: object,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.form = this.formBuilder.group({
      name:        new FormControl("", [Validators.required]),
      rate:        new FormControl("", [Validators.required]),
      guarantors:  new FormControl("", [Validators.required]),
      description: new FormControl(""),
    });
  }

  ngOnInit() {
    if (this.isBrowser) {
      this.editor = new Editor();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["loanTypeData"] && this.loanTypeData) {
      const lt = this.loanTypeData;
      this.id = lt.id;
      const loanName = (lt.name ?? lt.meta ?? "").toLowerCase().trim();
      this.isQuickCash = loanName === "quick cash";
      this.form.patchValue({
        name:        lt.name        ?? lt.meta             ?? "",
        rate:        lt.rate        ?? lt.interest         ?? "",
        guarantors:  this.isQuickCash ? 0 : (lt.guarantors  ?? lt.total_guarantors ?? ""),
        description: lt.description ?? lt.desc             ?? "",
      });
    }
  }

  incrementRate(field: string) {
    const ctrl = this.form.get(field);
    if (ctrl) ctrl.setValue((ctrl.value || 0) + 1);
  }

  decrementRate(field: string) {
    const ctrl = this.form.get(field);
    if (ctrl && (ctrl.value || 0) > 0) ctrl.setValue((ctrl.value || 0) - 1);
  }

  submit() {
    this.form.markAllAsTouched();
    if (!this.form.valid) return;

    const payload = { ...this.form.value };
    this.store.dispatch(new SetLoadingState(true));

    const action = this.type === "edit" && this.id
      ? new UpdateLoanType(payload, this.id)
      : new CreateLoanType(payload);

    this.store
      .dispatch(action)
      .pipe(
        finalize(() => this.store.dispatch(new SetLoadingState(false))),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (res: any) => {
          const response = res?.configurations?.response;
          const successStatus = this.type === "edit"
            ? appConfig.statusCode.ok
            : appConfig.statusCode.created;
          if (response?.status === successStatus) {
            this.notificationService.showSuccess(
              response?.message || (this.type === "edit" ? "Loan Type updated successfully" : "Loan Type created successfully")
            );
            this.router.navigateByUrl("/configurations/categories");
            this.tabError = [];
          } else {
            this.tabError = [];
            this.notificationService.showError(response?.message || "Update failed");
          }
        },
        error: (err) => {
          this.notificationService.showError(err?.message || "An unexpected error occurred");
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
