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
  NgbDate,
  NgbDateParserFormatter,
  NgbModule,
  NgbNav,
} from "@ng-bootstrap/ng-bootstrap";
import { Store } from "@ngxs/store";
import {
  Observable,
  Subject,
  debounceTime,
  distinctUntilChanged,
  finalize,
  map,
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
import { VariationCombination } from "../../../../shared/interface/product.interface";
import { MediaConfig, mediaConfig } from "../../../../shared/data/media-config";
import { Editor, NgxEditorModule } from "ngx-editor";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonModule, DOCUMENT, isPlatformBrowser } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { FormFieldsComponent } from "../../../../shared/components/ui/form-fields/form-fields.component";
import { ButtonComponent } from "../../../../shared/components/ui/button/button.component";
import { NavService } from "src/app/shared/services/nav.service";
import { Sidebar } from "src/app/shared/interface/sidebar.interface";
import { RouterModule } from "@angular/router";
import { MiscellaneousState } from "src/app/shared/store/state/miscellaneous.state";
import {
  CreateByeLaw,
  EditByeLaw,
  SetLoadingState,
  UpdateByeLaw,
} from "src/app/shared/store/action/miscellaneous.action";
import { appConfig } from "src/app/core/config/config";
import { NotificationService } from "src/app/shared/services/notification.service";

@Component({
  selector: "app-form-bye-law",
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
  templateUrl: "./form-bye-law.component.html",
  styleUrl: "./form-bye-law.component.scss",
})
export class FormByeLawComponent {
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
  public selectedCategories: number[] = [];
  public selectedTags: number[] = [];
  public variationCombinations: VariationCombination[] = [];
  public retrieveVariants: boolean = false;
  public variantCount: number = 0;
  public hoveredDate: NgbDate | null = null;
  public collectionProduct: Select2Data;
  private destroy$ = new Subject<void>();
  public mediaConfig: MediaConfig = mediaConfig;
  public editor: Editor;
  public html = "";
  public isCodeEditor = true;
  public templateGenerated = false;
  public selectedFile: File | null = null;
  public formSubmitted: boolean;
  public templateData: any;

  public fileType: Select2Data = [
    {
      value: "pdf",
      label: "PDF",
    },
    {
      value: "doc",
      label: "DOC",
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
    public formatter: NgbDateParserFormatter,
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: object,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.form = this.formBuilder.group({
      title: new FormControl("", [Validators.required]),
      file_type: new FormControl("Savings", [Validators.required]),
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
            .dispatch(new EditByeLaw(params["id"]))
            .pipe(
              mergeMap(() =>
                this.store.select(MiscellaneousState.selectedByeLaw)
              )
            );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((bl) => {
        if (bl) {
          this.id = bl.id;
          let patchData: any = {
            title: bl.title,
            file_type: bl.file_type,
          };

          this.form.patchValue(patchData);
        }
      });
  }

  submit() {
    this.form.markAllAsTouched();
    this.formSubmitted = true;

    if (!this.selectedFile || !this.form.valid) {
      this.notificationService.showError("Please fill all required fields");
      return;
    }

    const formData = new FormData();

    // Add form values
    Object.keys(this.form.value).forEach((key) => {
      formData.append(key, this.form.value[key]);
    });

    // Add the file
    formData.append(`doc_file`, this.selectedFile);

    // 1. Simple log method
    console.log("--- FormData Contents ---");
    formData.forEach((value, key) => {
      console.log(`${key}:`, value);
    });

    // 2. Detailed log method (recommended)
    console.log("--- Detailed FormData Inspection ---");
    const formDataObject: { [key: string]: any } = {};
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        formDataObject[key] = {
          filename: value.name,
          size: value.size + " bytes",
          type: value.type,
        };
      } else {
        formDataObject[key] = value;
      }
    }
    console.table(formDataObject);

    this.store.dispatch(new SetLoadingState(true));
    const action =
      this.type === "create"
        ? new CreateByeLaw(formData)
        : new UpdateByeLaw(formData, this.id);

    this.store
      .dispatch(action)
      .pipe(
        finalize(() => this.store.dispatch(new SetLoadingState(false))),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (res: any) => {
          const response = res?.miscellaneous?.response;
          const successStatus =
            this.type === "edit"
              ? appConfig.statusCode.ok
              : appConfig.statusCode.created;
          if (response?.status === successStatus) {
            const successMessage =
              this.type === "edit"
                ? "Bye Law updated successfully"
                : "Bye Law created successfully";
            this.notificationService.showSuccess(
              response?.message || successMessage
            );
            this.router.navigateByUrl("/miscellaneous");
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

  onFileChange(event: any) {
    const file = event.target.files[0];

    this.selectedFile = file;

    if (!file) return;

    if (file) {
      // Validate file type
      const validTypes = ["pdf", "doc", "docx"];
      const fileType = file.name.split(".").pop().toLowerCase();

      if (!validTypes.includes(fileType)) {
        this.notificationService.showError("File type is not allowed");
        event.target.value = ""; // Clear the input
        this.selectedFile = null;
        return;
      }

      if (file.size > 900 * 1024) {
        this.notificationService.showError("File size exceeded");
        event.target.value = "";
        this.selectedFile = null;
        return;
      }

      // Read file content if needed
      const reader = new FileReader();
      reader.onload = (e: any) => {
        // Your existing code
      };
      reader.readAsArrayBuffer(file);
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.form.reset();
    this.renderer.removeClass(this.document.body, "loader-none");
  }
}
