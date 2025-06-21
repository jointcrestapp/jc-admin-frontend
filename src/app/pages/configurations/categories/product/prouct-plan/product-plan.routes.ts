import { Routes } from "@angular/router";
import { AddProductPlanComponent } from "./add-product-plan/add-product-plan.component";
import { EditProductPlanComponent } from "./edit-product-plan/edit-product-plan.component";

export const productPlanRoutes: Routes = [
  {
    path: "add-product-plan",
    component: AddProductPlanComponent,
  },
  {
    path: "edit-product-plan/:id",
    component: EditProductPlanComponent,
  },
];
