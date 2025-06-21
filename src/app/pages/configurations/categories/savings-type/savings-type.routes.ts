import { Routes } from "@angular/router";
import { AddSavingTypeComponent } from "./add-saving-type/add-saving-type.component";
import { EditSavingTypeComponent } from "./edit-saving-type/edit-saving-type.component";

export const savingsTypeRoutes: Routes = [
  {
    path: "add-savings-type",
    component: AddSavingTypeComponent,
  },
  {
    path: "edit-savings-type/:id",
    component: EditSavingTypeComponent,
  },
];
