import { Routes } from "@angular/router";
import { AllInvestmentsComponent } from "./all-investments/all-investments.component";
import { AddInvestmentComponent } from "./add-investment/add-investment.component";
import { EditInvestmentComponent } from "./edit-investment/edit-investment.component";
import { InvestmentHistoryComponent } from "./investment-history/investment-history.component";

export const investmentRoutes: Routes = [
  {
    path: "",
    component: AllInvestmentsComponent,
  },
  {
    path: "history",
    component: InvestmentHistoryComponent,
  },
  {
    path: "add-investment",
    component: AddInvestmentComponent,
  },
  {
    path: "edit-investments/:id",
    component: EditInvestmentComponent,
  },
];
