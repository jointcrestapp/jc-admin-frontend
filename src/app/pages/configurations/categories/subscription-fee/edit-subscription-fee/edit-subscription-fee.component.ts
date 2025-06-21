import { Component } from "@angular/core";
import { PageWrapperComponent } from "../../../../../shared/components/page-wrapper/page-wrapper.component";
import { FormSubscriptionComponent } from "../subscription-form/form-subscription.component";

@Component({
  selector: "app-edit-subscription-fee",
  imports: [PageWrapperComponent, FormSubscriptionComponent],
  templateUrl: "./edit-subscription-fee.component.html",
  styleUrl: "./edit-subscription-fee.component.scss",
})
export class EditSubscriptionFeeComponent {}
