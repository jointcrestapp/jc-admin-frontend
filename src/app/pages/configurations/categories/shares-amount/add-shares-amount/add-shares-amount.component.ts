import { Component } from "@angular/core";
import { PageWrapperComponent } from "../../../../../shared/components/page-wrapper/page-wrapper.component";
import { FormShareAmountComponent } from "../share-amount-form/form-share-amount.component";

@Component({
  selector: "app-add-shares-amount",
  imports: [PageWrapperComponent, FormShareAmountComponent],
  templateUrl: "./add-shares-amount.component.html",
  styleUrl: "./add-shares-amount.component.scss",
})
export class AddSharesAmountComponent {}
