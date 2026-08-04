import {
  Component,
  ElementRef,
  Inject,
  PLATFORM_ID,
  Renderer2,
  ViewChild,
} from "@angular/core";
import {
  NgbDateParserFormatter,
  NgbModule,
  NgbNav,
} from "@ng-bootstrap/ng-bootstrap";
import { Store } from "@ngxs/store";
import { Observable, Subject, finalize, takeUntil } from "rxjs";
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
import { FormFieldsComponent } from "../../../shared/components/ui/form-fields/form-fields.component";
import { ButtonComponent } from "../../../shared/components/ui/button/button.component";
import { NavService } from "src/app/shared/services/nav.service";
import { Sidebar } from "src/app/shared/interface/sidebar.interface";
import { RouterModule } from "@angular/router";
import {
  SendPush,
  SetLoadingState,
} from "src/app/shared/store/action/communication.action";
import { appConfig } from "src/app/core/config/config";
import { NotificationService } from "src/app/shared/services/notification.service";
import { PageWrapperComponent } from "src/app/shared/components/page-wrapper/page-wrapper.component";

// Broadcasts an OS-level push notification (via FCM) plus an in-app announcement
// to every user in the selected segment. Unlike Broadcast (email) and SMS Report,
// there's no "Custom" recipient mode here — push targets registered app devices,
// not arbitrary contact strings an admin could type in.
@Component({
  selector: "app-push-notification",
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
    PageWrapperComponent,
  ],
  templateUrl: "./push-notification.component.html",
  styleUrl: "./push-notification.component.scss",
})
export class PushNotificationComponent {
  public menuItems: Sidebar[];
  public items: Sidebar[] = [];

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
  public recipients: Select2Option[] = [
    {
      value: 1,
      label: "Super Admin",
    },
    {
      value: 2,
      label: "Admin",
    },
    {
      value: 3,
      label: "Member",
    },
    {
      value: 4,
      label: "Agent",
    },
  ];

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private router: Router,
    public navServices: NavService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    public formatter: NgbDateParserFormatter,
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: object,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.form = this.formBuilder.group({
      recipient: new FormControl("", [Validators.required]),
      subject: new FormControl("", [Validators.required]),
      message: new FormControl("", [Validators.required]),
    });
  }

  ngOnInit() {
    if (this.isBrowser) {
      this.editor = new Editor();
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
    action = new SendPush(payload);

    this.store
      .dispatch(action)
      .pipe(
        finalize(() => this.store.dispatch(new SetLoadingState(false))),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (res: any) => {
          const response = res?.communication?.response;
          if (response?.status === appConfig.statusCode.created) {
            this.notificationService.showSuccess(response?.message);
            this.form.reset();
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
