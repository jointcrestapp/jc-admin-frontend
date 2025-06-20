
import { Routes } from '@angular/router';

import { AllThriftComponent } from './all-thrift/all-thrift.component';
import { AddBatchThriftComponent } from './add-batch-thrift/add-batch-thrift.component';
import { AddThriftComponent } from './add-thrift/add-thrift.component';
import { EditThriftComponent } from './edit-thrift/edit-thrift.component';
import { DetailsComponent } from './details/details.component';

export const thriftRoutes: Routes = [
  {
    path: "",
    component: AllThriftComponent
  },
  {
    path: "add-thrift",
    component: AddThriftComponent
  },
  {
    path: "add-batch-thrift",
    component: AddBatchThriftComponent
  },
  {
    path: "edit-thrift/:id",
    component: EditThriftComponent
  },
  {
    path: "details/:id",
    component: DetailsComponent
  }
];
