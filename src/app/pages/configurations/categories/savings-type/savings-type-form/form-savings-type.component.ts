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
import { FormFieldsComponent } from "../../../../../shared/components/ui/form-fields/form-fields.component";
import { ButtonComponent } from "../../../../../shared/components/ui/button/button.component";
import { NavService } from "src/app/shared/services/nav.service";
import { Sidebar } from "src/app/shared/interface/sidebar.interface";
import { RouterModule } from "@angular/router";
import { ConfigurationsState } from "src/app/shared/store/state/configurations.state";
import {
  CreateSavingsType,
  EditSavingsType,
  SetLoadingState,
  UpdateSavingsType,
} from "src/app/shared/store/action/configurations.action";
import { appConfig } from "src/app/core/config/config";
import { NotificationService } from "src/app/shared/services/notification.service";

@Component({
  selector: "app-form-savings-type",
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
  templateUrl: "./form-savings-type.component.html",
  styleUrl: "./form-savings-type.component.scss",
})
export class FormSavingsTypeComponent {
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
      max_withdrawal: new FormControl("", [Validators.required]),
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
            .dispatch(new EditSavingsType(params["id"]))
            .pipe(
              mergeMap(() =>
                this.store.select(ConfigurationsState.selectedSavingsType)
              )
            );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((st) => {
        console.log("Prod ::::::::::::::::", st);
        if (st) {
          this.id = st.id;
          let patchData: any = {
            name: st.name,
            max_withdrawal: st.max_withdrawal,
            description: st.description,
          };
          this.form.patchValue(patchData);
        }
      });
  }

  incrementRate() {
    const currentMaxWithdrawal = this.form.get("max_withdrawal")?.value || 0;
    this.form.get("max_withdrawal")?.setValue(currentMaxWithdrawal + 1);
  }

  decrementRate() {
    const currentMaxWithdrawal = this.form.get("max_withdrawal")?.value || 0;
    if (currentMaxWithdrawal > 0) {
      this.form.get("max_withdrawal")?.setValue(currentMaxWithdrawal - 1);
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
      action = new UpdateSavingsType(payload, this.id);
    }

    if (this.type === "create") {
      action = new CreateSavingsType(payload);
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
                ? "Savings Type updated successfully"
                : "Savings Type created successfully";
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
