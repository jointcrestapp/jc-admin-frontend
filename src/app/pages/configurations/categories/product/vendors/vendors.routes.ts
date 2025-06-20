import { Routes } from "@angular/router";
import { AddVendorComponent } from "./add-vendor/add-vendor.component";
import { EditVendorComponent } from "./edit-vendor/edit-vendor.component";

export const vendorsRoutes: Routes = [
  {
    path: "add-vendor",
    component: AddVendorComponent,
  },
  {
    path: "edit-vendor/:id",
    component: EditVendorComponent,
  },
];
