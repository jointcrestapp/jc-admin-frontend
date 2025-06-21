import { Routes } from "@angular/router";

export const productRoutes: Routes = [
  {
    path: "product-plan",
    loadChildren: () =>
      import("./prouct-plan/product-plan.routes").then(
        (r) => r.productPlanRoutes
      ),
  },
  {
    path: "products",
    loadChildren: () =>
      import("./proucts/products.routes").then((r) => r.productsRoutes),
  },
  {
    path: "vendors",
    loadChildren: () =>
      import("./vendors/vendors.routes").then((r) => r.vendorsRoutes),
  },
];
