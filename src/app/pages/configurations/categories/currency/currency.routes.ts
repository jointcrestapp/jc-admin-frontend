import { Routes } from "@angular/router";

import { AddCurrencyComponent } from "./add-currency/add-currency.component";
import { EditCurrencyComponent } from "./edit-currency/edit-currency.component";

export const currencyRoutes: Routes = [
  {
    path: "add-currency",
    component: AddCurrencyComponent,
  },
  {
    path: "edit-currency/:id",
    component: EditCurrencyComponent,
  },
];
