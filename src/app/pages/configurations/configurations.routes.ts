import { Routes } from "@angular/router";

import { AllUsersRolesComponent } from "./users-role/all-users-roles/all-users-roles.component";
import { CategoriesComponent } from "./categories/categories.component";

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
    path: "subscription-fee",
    loadChildren: () =>
      import("./categories/subscription-fee/subscription-fee.routes").then(
        (r) => r.subscriptionFeeRoutes
      ),
  },
  {
    path: "share-amount",
    loadChildren: () =>
      import("./categories/shares-amount/share-amount.routes").then(
        (r) => r.shareAMountRoutes
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
