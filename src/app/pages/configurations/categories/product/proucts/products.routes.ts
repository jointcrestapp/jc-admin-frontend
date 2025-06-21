import { Routes } from "@angular/router";
import { AddProductComponent } from "./add-product/add-product.component";
import { EditProductComponent } from "./edit-product/edit-product.component";

export const productsRoutes: Routes = [
  {
    path: "add-products",
    component: AddProductComponent,
  },
  {
    path: "edit-products/:id",
    component: EditProductComponent,
  },
];
