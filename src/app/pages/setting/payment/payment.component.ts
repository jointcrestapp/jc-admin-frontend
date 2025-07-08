import { Component } from "@angular/core";
import { PageWrapperComponent } from "src/app/shared/components/page-wrapper/page-wrapper.component";
import { FormPaymentAPIComponent } from "../form-payment/form-payment.component";

@Component({
  selector: "app-payment",
  imports: [PageWrapperComponent, FormPaymentAPIComponent],
  templateUrl: "./payment.component.html",
  styleUrl: "./payment.component.scss",
})
export class PaymentComponent {}
