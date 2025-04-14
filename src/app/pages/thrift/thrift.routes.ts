
import { Routes } from '@angular/router';

import { AllThriftComponent } from './all-thrift/all-thrift.component';
import { ThriftTierComponent } from './thrift-tier/thrift-tier.component';
import { ThriftCategoryComponent } from './thrift-category/thrift-category.component';

export const thriftRoutes: Routes = [
  {
    path: "",
    component: AllThriftComponent
  },
  {
    path: "thrift-tiers",
    component: ThriftTierComponent
  },
  {
    path: "thrift-category",
    component: ThriftCategoryComponent
  }
];
