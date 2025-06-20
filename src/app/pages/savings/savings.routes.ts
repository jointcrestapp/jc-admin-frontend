
import { Routes } from '@angular/router';

import { AllSavingsComponent } from './all-savings/all-savings.component';
import { AddSingleSavingsComponent } from './add-single-savings/add-single-savings.component';
import { EditSavingsComponent } from './edit-savings/edit-savings.component';
import { AddBatchSavingsComponent } from './add-batch-savings/add-batch-savings.component';
import { DetailsComponent } from './details/details.component'

export const savingsRoutes: Routes = [
  {
    path: "",
    component: AllSavingsComponent
  },
  {
    path: "add-single-savings",
    component: AddSingleSavingsComponent
  },
  {
    path: "add-batch-savings",
    component: AddBatchSavingsComponent
  },
  {
    path: "edit-savings/:id",
    component: EditSavingsComponent
  },
  {
    path: "details/:id",
    component: DetailsComponent
  }
];
