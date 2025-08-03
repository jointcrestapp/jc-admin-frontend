import { Component } from "@angular/core";
import { PageWrapperComponent } from "src/app/shared/components/page-wrapper/page-wrapper.component";
import { FormProductComponent } from "../product-form/form-product.component";
import { ButtonComponent } from "../../../../../../shared/components/ui/button/button.component";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { Location } from "@angular/common";

@Component({
  selector: "app-add-product",
  imports: [
    PageWrapperComponent,
    FormProductComponent,
    ButtonComponent,
    RouterModule,
  ],
  templateUrl: "./add-product.component.html",
  styleUrl: "./add-product.component.scss",
})
export class AddProductComponent {
  returnTab: string = "products";
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
