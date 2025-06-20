import { Component } from "@angular/core";
import { PageWrapperComponent } from "src/app/shared/components/page-wrapper/page-wrapper.component";
import { FormInvestmentComponent } from "../investment-form/form-investment.component";

@Component({
  selector: "app-add-investment",
  imports: [PageWrapperComponent, FormInvestmentComponent],
  templateUrl: "./add-investment.component.html",
  styleUrl: "./add-investment.component.scss",
})
export class AddInvestmentComponent {}
