import { Component } from "@angular/core";
import { PageWrapperComponent } from "src/app/shared/components/page-wrapper/page-wrapper.component";
import { FormLoanTypeComponent } from "../loan-type-form/form-loan-type.component";

@Component({
  selector: "app-edit-loan-type",
  imports: [PageWrapperComponent, FormLoanTypeComponent],
  templateUrl: "./edit-loan-type.component.html",
  styleUrl: "./edit-loan-type.component.scss",
})
export class EditLoanTypeComponent {}
