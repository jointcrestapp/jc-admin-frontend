import { Routes } from "@angular/router";
import { AddLoanTypeComponent } from "./add-loan-type/add-loan-type.component";
import { EditLoanTypeComponent } from "./edit-loan-type/edit-loan-type.component";

export const loanTypeRoutes: Routes = [
  {
    path: "add-loan-type",
    component: AddLoanTypeComponent,
  },
  {
    path: "edit-loan-type/:id",
    component: EditLoanTypeComponent,
  },
];
