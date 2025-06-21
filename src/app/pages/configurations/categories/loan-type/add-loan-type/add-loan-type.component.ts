import { Component } from "@angular/core";
import { PageWrapperComponent } from "src/app/shared/components/page-wrapper/page-wrapper.component";
import { FormLoanTypeComponent } from "../loan-type-form/form-loan-type.component";

@Component({
  selector: "app-add-loan-type",
  imports: [PageWrapperComponent, FormLoanTypeComponent],
  templateUrl: "./add-loan-type.component.html",
  styleUrl: "./add-loan-type.component.scss",
})
export class AddLoanTypeComponent {}
