import { Component } from "@angular/core";
import { PageWrapperComponent } from "../../../../../shared/components/page-wrapper/page-wrapper.component";
import { FormCurrencyComponent } from "../currency-form/form-currency.component";
import { Router } from "@angular/router";
import { Location } from "@angular/common";

@Component({
  selector: "app-add-currency",
  imports: [PageWrapperComponent, FormCurrencyComponent],
  templateUrl: "./add-currency.component.html",
  styleUrl: "./add-currency.component.scss",
})
export class AddCurrencyComponent {
  constructor(private router: Router, private location: Location) {}
  goback() {
    this.location.back();
  }
}
