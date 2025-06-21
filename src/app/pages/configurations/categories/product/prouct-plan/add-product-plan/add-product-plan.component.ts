import { Component } from "@angular/core";
import { PageWrapperComponent } from "src/app/shared/components/page-wrapper/page-wrapper.component";
import { FormProductPlanComponent } from "../product-plan-form/form-product-plan.component";

@Component({
  selector: "app-add-product-plan",
  imports: [PageWrapperComponent, FormProductPlanComponent],
  templateUrl: "./add-product-plan.component.html",
  styleUrl: "./add-product-plan.component.scss",
})
export class AddProductPlanComponent {}
