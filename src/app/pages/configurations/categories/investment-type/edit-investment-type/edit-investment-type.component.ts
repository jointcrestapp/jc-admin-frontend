import { Component } from "@angular/core";
import { PageWrapperComponent } from "src/app/shared/components/page-wrapper/page-wrapper.component";
import { FormInvestmentTypeComponent } from "./../investment-type-form/form-investment-type.component";

@Component({
  selector: "app-edit-investment-type",
  imports: [PageWrapperComponent, FormInvestmentTypeComponent],
  templateUrl: "./edit-investment-type.component.html",
  styleUrl: "./edit-investment-type.component.scss",
})
export class EditInvestmentTypeComponent {}
