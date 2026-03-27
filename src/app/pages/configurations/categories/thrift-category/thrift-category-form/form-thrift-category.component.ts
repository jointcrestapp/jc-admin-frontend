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
  CreateThriftCategory,
  EditThriftCategory,
  SetLoadingState,
  UpdateThriftCategory,
} from "src/app/shared/store/action/configurations.action";
import { appConfig } from "src/app/core/config/config";
import { NotificationService } from "src/app/shared/services/notification.service";
import { ThriftsState } from "src/app/shared/store/state/thrift.state";
import { GetThriftsTiers } from "src/app/shared/store/action/thrift.action";

@Component({
  selector: "app-form-thrift-category",
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
  templateUrl: "./form-thrift-category.component.html",
  styleUrl: "./form-thrift-category.component.scss",
})
export class FormThriftCategoryComponent {
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
  public tiers$: Observable<any>;
  public tabError: string[] | null = [];
  public form: FormGroup;
  public id: number;
  private destroy$ = new Subject<void>();
  public editor: Editor;

  public members_allowed: Select2Option[];

  public metas: Select2Data = [
    {
      value: "Daily",
      label: "Daily",
    },
    {
      value: "Weekly",
      label: "Weekly",
    },
    {
      value: "Monthly",
      label: "Monthly",
    },
    {
      value: "Yearly",
      label: "Yearly",
    },
  ];
  public durations: Select2Data = [
    {
      value: 1,
      label: "Daily",
    },
    {
      value: 2,
      label: "Weekly",
    },
    {
      value: 3,
      label: "Monthly",
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
    this.tiers$ = this.store.select(ThriftsState.tiers);
    this.form = this.formBuilder.group({
      meta: new FormControl("", [Validators.required]),
      tiers_id: new FormControl("", [Validators.required]),
      duration: new FormControl("", [Validators.required]),
      members_allowed: new FormControl("", [Validators.required]),
    });
  }

  ngOnInit() {
    if (this.isBrowser) {
      this.editor = new Editor();
    }
    this.getThriftsTiers();
    this.members_allowed = this.generateNumberOptions();
    this.route.params
      .pipe(
        switchMap((params) => {
          if (!params["id"]) return of();
          return this.store
            .dispatch(new EditThriftCategory(params["id"]))
            .pipe(
              mergeMap(() =>
                this.store.select(ConfigurationsState.selectedThriftCategory)
              )
            );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((tc) => {
        console.log("Thrift Thrift ::::::::::::::", tc);
        if (tc) {
          this.id = tc.id;
          let patchData: any = {
            meta: tc.name,
            duration: Number(tc.duration),
            members_allowed: Number(tc.members_allowed),
            tiers_id: tc.tiers_id,
          };
          this.form.patchValue(patchData);
        }
      });
  }

  generateNumberOptions() {
    const options = [];
    for (let i = 1; i <= 10; i++) {
      options.push({
        value: i,
        label: `${i}`,
      });
    }
    return options;
  }

  getThriftsTiers() {
    this.store.dispatch(new GetThriftsTiers({}));
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
      action = new UpdateThriftCategory(payload, this.id);
    }

    if (this.type === "create") {
      action = new CreateThriftCategory(payload);
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
