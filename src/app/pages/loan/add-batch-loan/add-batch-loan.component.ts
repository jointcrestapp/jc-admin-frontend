import { Component } from "@angular/core";
import { PageWrapperComponent } from "src/app/shared/components/page-wrapper/page-wrapper.component";
import { BatchFormLoanComponent } from "../bacth-loan-form/batch-form-loan.component";

@Component({
  selector: "app-add-batch-loan",
  imports: [PageWrapperComponent, BatchFormLoanComponent],
  templateUrl: "./add-batch-loan.component.html",
  styleUrl: "./add-batch-loan.component.scss",
})
export class AddBatchLoanComponent {}
