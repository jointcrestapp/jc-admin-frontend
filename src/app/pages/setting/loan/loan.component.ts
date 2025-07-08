import { Component } from "@angular/core";
import { PageWrapperComponent } from "src/app/shared/components/page-wrapper/page-wrapper.component";
import { FormLoanComponent } from "../form-loan/form-loan.component";

@Component({
  selector: "app-loan",
  imports: [PageWrapperComponent, FormLoanComponent],
  templateUrl: "./loan.component.html",
  styleUrl: "./loan.component.scss",
})
export class LoanComponent {}
