import { Component } from "@angular/core";
import { PageWrapperComponent } from "../../../../../shared/components/page-wrapper/page-wrapper.component";
import { FormSubscriptionComponent } from "../subscription-form/form-subscription.component";
import { Router } from "@angular/router";
import { Location } from "@angular/common";

@Component({
  selector: "app-add-currency",
  imports: [PageWrapperComponent, FormSubscriptionComponent],
  templateUrl: "./add-subscription.component.html",
  styleUrl: "./add-subscription.component.scss",
})
export class AddSubscriptionComponent {
  constructor(private router: Router, private location: Location) {}
  goback() {
    this.location.back();
  }
}
