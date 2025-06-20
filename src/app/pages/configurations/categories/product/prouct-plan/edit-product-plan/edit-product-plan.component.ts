import { Component } from "@angular/core";
import { PageWrapperComponent } from "src/app/shared/components/page-wrapper/page-wrapper.component";
import { FormProductPlanComponent } from "../product-plan-form/form-product-plan.component";

@Component({
  selector: "app-edit-product-plan",
  imports: [PageWrapperComponent, FormProductPlanComponent],
  templateUrl: "./edit-product-plan.component.html",
  styleUrl: "./edit-product-plan.component.scss",
})
export class EditProductPlanComponent {}
