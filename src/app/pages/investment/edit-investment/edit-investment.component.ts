import { Component } from "@angular/core";
import { PageWrapperComponent } from "src/app/shared/components/page-wrapper/page-wrapper.component";
import { FormInvestmentComponent } from "../investment-form/form-investment.component";

@Component({
  selector: "app-edit-investment",
  imports: [PageWrapperComponent, FormInvestmentComponent],
  templateUrl: "./edit-investment.component.html",
  styleUrl: "./edit-investment.component.scss",
})
export class EditInvestmentComponent {}
