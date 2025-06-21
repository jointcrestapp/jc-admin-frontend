import {
  Component,
  EventEmitter,
  inject,
  Output,
  TemplateRef,
  ViewChild,
  ElementRef,
  Renderer2,
  Inject,
  PLATFORM_ID,
  Input,
} from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { ButtonComponent } from "../../button/button.component";
import { TableClickedAction } from "../../../../interface/table.interface";
import {
  ModalDismissReasons,
  NgbDate,
  NgbDateParserFormatter,
  NgbModal,
  NgbModalRef,
  NgbModule,
  NgbNav,
} from "@ng-bootstrap/ng-bootstrap";
import { NavService } from "src/app/shared/services/nav.service";
import { FormFieldsComponent } from "../../form-fields/form-fields.component";
import { Sidebar } from "src/app/shared/interface/sidebar.interface";
import { Store } from "@ngxs/store";
import { Observable, Subject, take } from "rxjs";
import { SavingsState } from "src/app/shared/store/state/savings.state";
import { GetFilteredMembers } from "src/app/shared/store/action/savings.action";
import { RouterModule } from "@angular/router";
import { CommonModule, DOCUMENT, isPlatformBrowser } from "@angular/common";
import { Select2Data, Select2Module } from "ng-select2-component";
import {
  MediaConfig,
  mediaConfig,
} from "../../../../../shared/data/media-config";
import { Editor, NgxEditorModule } from "ngx-editor";
import { NotificationService } from "src/app/shared/services/notification.service";

@Component({
  selector: "app-add-credit-sales-modal",
  standalone: true,
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
  templateUrl: "./add-credit-sales-modal.component.html",
  styleUrls: ["./add-credit-sales-modal.component.scss"],
})
export class AddCreditSalesModalComponent {
  @ViewChild("addCreditSalesModal") modalTemplate!: TemplateRef<any>;
  @Output() confirmed = new EventEmitter<TableClickedAction>();

  public menuItems: Sidebar[];

  public closeResult = "";
  public modalRef: NgbModalRef | null = null;
  public userAction!: TableClickedAction;
  public searchResult = false;
  public searchResultEmpty = false;
  public text = "";
  public selectedMember: any = null;
  public items: Sidebar[] = [];
  public form: FormGroup;
  public message: string = "Add user to this order";

  public quantities: Select2Data = [
    {
      value: 1,
      label: "1",
    },
    {
      value: 2,
      label: "2",
    },
    {
      value: 3,
      label: "3",
    },
    {
      value: 4,
      label: "4",
    },
    {
      value: 5,
      label: "5",
    },
    {
      value: 6,
      label: "6",
    },
    {
      value: 7,
      label: "7",
    },
    {
      value: 8,
      label: "8",
    },
    {
      value: 9,
      label: "9",
    },
    {
      value: 10,
      label: "10",
    },
    {
      value: 11,
      label: "11",
    },
    {
      value: 12,
      label: "12",
    },
    {
      value: 13,
      label: "13",
    },
    {
      value: 14,
      label: "14",
    },
    {
      value: 15,
      label: "15",
    },
    {
      value: 16,
      label: "16",
    },
    {
      value: 17,
      label: "17",
    },
    {
      value: 18,
      label: "18",
    },
    {
      value: 19,
      label: "19",
    },
    {
      value: 20,
      label: "20",
    },
  ];

  private member$: Observable<any> = inject(Store).select(SavingsState.member);
  public open = false;

  @Input() type: string;
  @ViewChild("nav") nav: NgbNav;
  @ViewChild("toggleButton") toggleButton: ElementRef;
  @ViewChild("menu") menu: ElementRef;
  @ViewChild("dropdownContainer", { static: false })
  dropdownContainer: ElementRef;

  public attribute$: Observable<Select2Data>;
  public tabError: string[] | null = [];
  public id: number;
  public selectedCategories: number[] = [];
  public selectedTags: number[] = [];
  public retrieveVariants: boolean = false;
  public variantCount: number = 0;
  public fromDate: NgbDate | null;
  public toDate: NgbDate | null;
  public hoveredDate: NgbDate | null = null;
  public collectionProduct: Select2Data;
  private destroy$ = new Subject<void>();
  public mediaConfig: MediaConfig = mediaConfig;
  public editor: Editor;
  public html = "";
  public isCodeEditor = true;
  public isBrowser: boolean;

  constructor(
    private modalService: NgbModal,
    public navServices: NavService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private store: Store,
    public formatter: NgbDateParserFormatter,
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: object,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.form = this.formBuilder.group({
      user_id: new FormControl("", [Validators.required]),
      qty: new FormControl("", [Validators.required]),
    });
  }

  openModal(action: string, data?: any, value?: any): void {
    this.userAction = {
      actionToPerform: action,
      data: data,
      value: value,
    };

    this.modalRef = this.modalService.open(this.modalTemplate, {
      ariaLabelledBy: "Confirmation-Modal",
      centered: true,
      windowClass: "theme-modal text-center",
    });

    this.modalRef.result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }

  private getDismissReason(reason: ModalDismissReasons): string {
    switch (reason) {
      case ModalDismissReasons.ESC:
        return "by pressing ESC";
      case ModalDismissReasons.BACKDROP_CLICK:
        return "by clicking on a backdrop";
      default:
        return `with: ${reason}`;
    }
  }

  confirm(): void {
    this.form.markAllAsTouched();
    if (!this.form.valid) {
      return;
    }

    const qty = this.form.get("qty")?.value;

    if (qty === null || qty === undefined || isNaN(qty)) {
      this.notificationService.showError("Please enter a valid quantity");
      return;
    } else if (qty > this.userAction.data.available) {
      this.notificationService.showError(
        "Selected quantity is greater than available stock"
      );
      return;
    } else {
      let payload = { ...this.form.value };
      this.userAction = {
        data: {
          ...this.userAction.data,
          user_id: payload.user_id,
          qty: payload.qty,
        },
        actionToPerform: this.userAction.actionToPerform,
        value: this.userAction.value,
      };
      this.confirmed.emit(this.userAction);
      this.modalRef?.close();
    }
  }

  closeModal(): void {
    this.modalRef?.dismiss();

    this.text = "";
    this.form.reset(
      this.form.reset({
        user_id: "",
        qty: "",
      })
    );
  }

  closeSearch() {
    this.navServices.search = false;
  }

  selectMember(member: any) {
    this.selectedMember = member;
    this.text = member.title; // Display the name in the input
    this.message = "Are you sure you want to add this user ?";
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
    if (this.isBrowser) {
      this.editor = new Editor();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.form.reset();
    this.renderer.removeClass(this.document.body, "loader-none");
  }
}
