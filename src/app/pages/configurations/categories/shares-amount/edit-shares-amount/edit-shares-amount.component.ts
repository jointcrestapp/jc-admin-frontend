import { Component } from "@angular/core";
import { PageWrapperComponent } from "../../../../../shared/components/page-wrapper/page-wrapper.component";
import { FormShareAmountComponent } from "../share-amount-form/form-share-amount.component";

@Component({
  selector: "app-edit-shares-amount",
  imports: [PageWrapperComponent, FormShareAmountComponent],
  templateUrl: "./edit-shares-amount.component.html",
  styleUrl: "./edit-shares-amount.component.scss",
})
export class EditSharesAmountComponent {}
