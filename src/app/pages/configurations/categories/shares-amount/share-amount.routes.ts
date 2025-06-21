import { Routes } from "@angular/router";

import { AddSharesAmountComponent } from "./add-shares-amount/add-shares-amount.component";
import { EditSharesAmountComponent } from "./edit-shares-amount/edit-shares-amount.component";

export const shareAMountRoutes: Routes = [
  {
    path: "add-share-amount",
    component: AddSharesAmountComponent,
  },
  {
    path: "edit-share-amount/:id",
    component: EditSharesAmountComponent,
  },
];
