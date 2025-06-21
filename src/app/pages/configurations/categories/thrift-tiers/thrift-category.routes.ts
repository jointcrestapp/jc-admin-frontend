import { Routes } from "@angular/router";

import { AddThriftTierComponent } from "./add-thrift-tier/add-thrift-tier.component";
import { EditThriftTierComponent } from "./edit-thrift-tier/edit-thrift-tier.component";

export const thriftTierRoutes: Routes = [
  {
    path: "add-thrift-tier",
    component: AddThriftTierComponent,
  },
  {
    path: "edit-thrift-tier/:id",
    component: EditThriftTierComponent,
  },
];
