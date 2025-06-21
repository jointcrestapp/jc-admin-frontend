import { Component } from "@angular/core";
import { PageWrapperComponent } from "../../../shared/components/page-wrapper/page-wrapper.component";
import { FormWithdrawalComponent } from "../withdrawal-form/form-withdrawal.component";

@Component({
  selector: "app-edit-withdrawal",
  imports: [PageWrapperComponent, FormWithdrawalComponent],
  templateUrl: "./edit-withdrawal.component.html",
  styleUrl: "./edit-withdrawal.component.scss",
})
export class EditWithdrawalComponent {}
