import { Component } from "@angular/core";
import { PageWrapperComponent } from "src/app/shared/components/page-wrapper/page-wrapper.component";
import { FormInvestmentTypeComponent } from "./../investment-type-form/form-investment-type.component";

@Component({
  selector: "app-add-investment-type",
  imports: [PageWrapperComponent, FormInvestmentTypeComponent],
  templateUrl: "./add-investment-type.component.html",
  styleUrl: "./add-investment-type.component.scss",
})
export class AddInvestmentTypeComponent {}
