import { Routes } from "@angular/router";

import { AddThriftCategoryComponent } from "./add-thrift-category/add-thrift-category.component";
import { EditThriftCategoryComponent } from "./edit-thrift-category/edit-thrift-category.component";

export const thriftCategoryRoutes: Routes = [
  {
    path: "add-thrift-category",
    component: AddThriftCategoryComponent,
  },
  {
    path: "edit-thrift-category/:id",
    component: EditThriftCategoryComponent,
  },
];
