
import { Routes } from '@angular/router';

import { AllSavingsComponent } from './all-savings/all-savings.component';
import { AddSingleSavingsComponent } from './add-single-savings/add-single-savings.component';
import { EditSavingsComponent } from './edit-savings/edit-savings.component';
import { AddBatchSavingsComponent } from './add-batch-savings/add-batch-savings.component';

export const thriftRoutes: Routes = [
  {
    path: "",
    component: AllSavingsComponent
  },
  {
    path: "add_single_savings",
    component: AddSingleSavingsComponent
  },
  {
    path: "add_batch_savings",
    component: AddBatchSavingsComponent
  },
  {
    path: "edit_savings/:id",
    component: EditSavingsComponent
  }
];
