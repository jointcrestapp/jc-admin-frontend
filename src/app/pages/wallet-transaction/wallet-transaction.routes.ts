import { Routes } from "@angular/router";
import { AllWalletTransactionsComponent } from "./all-wallet-transactions/all-wallet-transactions.component";
import { DetailsComponent } from "./details/details.component";

export const walletTransactionRoutes: Routes = [
  {
    path: "",
    component: AllWalletTransactionsComponent,
  },
  {
    path: "details/:id",
    component: DetailsComponent,
  },
];
