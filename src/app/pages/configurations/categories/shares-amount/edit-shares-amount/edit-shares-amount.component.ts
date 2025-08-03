import { Component } from "@angular/core";
import { PageWrapperComponent } from "../../../../../shared/components/page-wrapper/page-wrapper.component";
import { FormShareAmountComponent } from "../share-amount-form/form-share-amount.component";
import { ButtonComponent } from "../../../../../shared/components/ui/button/button.component";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { Location } from "@angular/common";

@Component({
  selector: "app-edit-shares-amount",
  imports: [
    PageWrapperComponent,
    FormShareAmountComponent,
    RouterModule,
    ButtonComponent,
  ],
  templateUrl: "./edit-shares-amount.component.html",
  styleUrl: "./edit-shares-amount.component.scss",
})
export class EditSharesAmountComponent {
  returnTab: string = "shares_amount";
  returnUrl: string = "/configurations/categories";

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit() {
    // Get return information from query params
    this.route.queryParams.subscribe((params) => {
      if (params["returnTab"]) {
        this.returnTab = params["returnTab"];
      }
      if (params["returnUrl"]) {
        this.returnUrl = params["returnUrl"];
      }
    });
  }

  // Method to go back to the categories page with the correct tab
  goBack() {
    this.router.navigate([this.returnUrl], {
      queryParams: { tab: this.returnTab },
    });
  }

  // Alternative method using browser back with fallback
  goBackWithFallback() {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.goBack();
    }
  }

  // Method to handle successful form submission
  onSaveSuccess() {
    // After saving, navigate back to the correct tab
    this.goBack();
  }
}
