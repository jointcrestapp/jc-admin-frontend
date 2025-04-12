
import { Routes } from '@angular/router';

import { AllSharesComponent } from './all-shares/all-shares.component';
import { AddSingleShareComponent } from './add-single-share/add-single-share.component';
import { AddBatchSharesComponent } from './add-batch-shares/add-batch-shares.component';
import { EditShareComponent } from './edit-share/edit-share.component';

export const sharesRoutes: Routes = [
  {
    path: "",
    component: AllSharesComponent
  },
  {
    path: "add_single_share",
    component: AddSingleShareComponent
  },
  {
    path: "add_batch_shares",
    component: AddBatchSharesComponent
  },
  {
    path: "edit-share/:id",
    component: EditShareComponent
  }
];
