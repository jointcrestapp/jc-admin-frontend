import { Routes } from "@angular/router";

import { AddInvestmentTypeComponent } from "./add-investment-type/add-investment-type.component";
import { EditInvestmentTypeComponent } from "./edit-investment-type/edit-investment-type.component";

export const investmentTypeRoutes: Routes = [
  {
    path: "add-investment-type",
    component: AddInvestmentTypeComponent,
  },
  {
    path: "edit-investment-type/:id",
    component: EditInvestmentTypeComponent,
  },
];
