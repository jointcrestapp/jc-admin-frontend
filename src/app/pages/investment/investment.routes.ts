
import { Routes } from '@angular/router';
import { AllInvestmentsComponent } from './all-investments/all-investments.component';
import { AddInvestmentComponent } from './add-investment/add-investment.component';
import { EditInvestmentComponent } from './edit-investment/edit-investment.component';





export const investmentRoutes: Routes = [
  {
    path: '',
    component: AllInvestmentsComponent
  },
  {
    path: 'add_investment',
    component: AddInvestmentComponent
  },
  {
    path: 'edit_investment:/id',
    component: EditInvestmentComponent
  }
];
