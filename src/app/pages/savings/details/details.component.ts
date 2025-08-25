import {
  Component,
  Inject,
  Input,
  PLATFORM_ID,
  Renderer2,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { CommonModule, DOCUMENT, isPlatformBrowser } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { DatePipe, Location } from "@angular/common";
import { CurrencySymbolPipe } from "../../../shared/pipe/currency-symbol.pipe";
import { Store } from "@ngxs/store";
import { ActivatedRoute, Router } from "@angular/router";
import { NavService } from "src/app/shared/services/nav.service";
import { NotificationService } from "src/app/shared/services/notification.service";
import { Editor } from "ngx-editor";
import { mergeMap, of, Subject, switchMap, takeUntil } from "rxjs";
import { EditSavings } from "src/app/shared/store/action/savings.action";
import { SavingsState } from "src/app/shared/store/state/savings.state";
import { LOGO_BASE64 } from "public/assets/images/base64/logo.base64";

@Component({
  selector: "app-details",
  imports: [CommonModule, TranslateModule, CurrencySymbolPipe, DatePipe],
  templateUrl: "./details.component.html",
  styleUrl: "./details.component.scss",
  standalone:true
})
export class DetailsComponent {
  @ViewChild("slipContent", { static: false }) slipContent!: ElementRef;
  public isBrowser: boolean;
  public editor: Editor;
  private destroy$ = new Subject<void>();
  public savingDetails: any;
  logoBase64 = LOGO_BASE64;

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private router: Router,
    public navServices: NavService,
    private notificationService: NotificationService,
    private renderer: Renderer2,
    private location: Location,
    @Inject(PLATFORM_ID) private platformId: object,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
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
            .dispatch(new EditSavings(params["id"]))
            .pipe(
              mergeMap(() => this.store.select(SavingsState.selectedSavings))
            );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((saving) => {
        console.log("Savings Details ::::::::::", saving);
        if (saving) {
          this.savingDetails = saving;
          this.savingDetails.status =
            this.savingDetails.status === 0 ? "Pending" : "Completed";
          this.savingDetails.transaction_id = `SAV-${new Date().getFullYear()}-${
            saving.id
          }`;
        }
      });
  }

  // Default dummy data
  @Input() savings: any = {
    transaction_id: "SAV-2023-05678",
    amount: 5000.0,
    interest_rate: 3.5,
    created_at: new Date(),
    status: "completed",
    type: "fixed deposit",
    maturity_date: new Date(
      new Date().setFullYear(new Date().getFullYear() + 1)
    ),
    expected_interest: 175.0,
    total_at_maturity: 5175.0,
  };

  @Input() member: any = {
    first_name: "John",
    last_name: "Doe",
    member_id: "M-987654",
    address_line1: "123 Main Street",
    city: "New York",
    state: "NY",
    postal_code: "10001",
  };

  printClip() {
    if (!this.slipContent) {
      window.print();
      return;
    }

    const printContents = this.slipContent.nativeElement.innerHTML;
    const popupWin = window.open("", "_blank", "width=800,height=600");
    if (popupWin) {
      popupWin.document.open();
      
      popupWin.document.write(`
        <html>
          <head>
            <title>Print Slip</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .card, .highlight-card, .details-table, .slip-header, .slip-footer { margin-bottom: 16px; }
              .no-print { display: none !important; }
              /* Add more styles as needed for print */
            </style>
          </head>
          <body onload="window.print();window.close()">${printContents}</body>
        </html>
      `);
      popupWin.document.close();
    }
  }

  
  closeSlip(): void {
    // This would be handled by the parent component
    this.location.back();
  }
}
