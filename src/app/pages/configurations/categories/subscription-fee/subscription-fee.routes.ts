import { Routes } from "@angular/router";

import { AddSubscriptionComponent } from "./add-subscription-fee/add-subscription.component";
import { EditSubscriptionFeeComponent } from "./edit-subscription-fee/edit-subscription-fee.component";

export const subscriptionFeeRoutes: Routes = [
  {
    path: "add-subscription-fee",
    component: AddSubscriptionComponent,
  },
  {
    path: "edit-subscription-fee/:id",
    component: EditSubscriptionFeeComponent,
  },
];
