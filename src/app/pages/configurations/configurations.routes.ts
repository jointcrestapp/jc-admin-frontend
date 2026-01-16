import { Routes } from "@angular/router";

import { AllUsersRolesComponent } from "./users-role/all-users-roles/all-users-roles.component";
import { CategoriesComponent } from "./categories/categories.component";
import { otherCategoriesRoutes } from './categories/other-categories/other-categories.routes';

export const configurationRoutes: Routes = [
  {
    path: "categories",
    component: CategoriesComponent,
  },
  {
    path: "currency",
    loadChildren: () =>
      import("./../configurations/categories/currency/currency.routes").then(
        (r) => r.currencyRoutes
      ),
  },
  
  {
    path: "thrift-category",
    loadChildren: () =>
      import("./categories/thrift-category/thrift-category.routes").then(
        (r) => r.thriftCategoryRoutes
      ),
  },
  {
    path: "thrift-tier",
    loadChildren: () =>
      import("./categories/thrift-tiers/thrift-category.routes").then(
        (r) => r.thriftTierRoutes
      ),
  },
  {
    path: "investment-type",
    loadChildren: () =>
      import("./categories/investment-type/investment-type.routes").then(
        (r) => r.investmentTypeRoutes
      ),
  },
  {
    path: "product",
    loadChildren: () =>
      import("./categories/product/product.routes").then(
        (r) => r.productRoutes
      ),
  },
  {
    path: "loan-type",
    loadChildren: () =>
      import("./categories/loan-type/loan-type.routes").then(
        (r) => r.loanTypeRoutes
      ),
  },
  {
    path: "share-type",
    loadChildren: () =>
      import("./categories/shares-type/shares-type.routes").then(
        (r) => r.shareTypeRoutes
      ),
  },
  {
    path: "savings-type",
    loadChildren: () =>
      import("./categories/savings-type/savings-type.routes").then(
        (r) => r.savingsTypeRoutes
      ),
  },
  {
    path: "financial-settings",
    loadChildren: () =>
      import("./categories/other-categories/other-categories.routes").then(
        (r) => r.otherCategoriesRoutes
      ),
  },
  {
    path: "users-role",
    loadChildren: () =>
      import("./users-role/user-roles.routes").then(
        (r) => r.userRolesTypeRoutes
      ),
  },
  // {
  //   path: "users-role",
  //   component: AllUsersRolesComponent,
  // },
];
