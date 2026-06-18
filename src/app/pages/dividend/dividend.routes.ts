import { Routes } from '@angular/router';
import { DividendHistoryComponent } from './dividend-history/dividend-history.component';
import { GenerateDividendComponent } from './generate-dividend/generate-dividend.component';
import { MonthlyProfitsComponent } from './monthly-profits/monthly-profits.component';

export const dividendRoutes: Routes = [
  {
    path: '',
    component: DividendHistoryComponent,
  },
  {
    path: 'generate-dividend',
    component: GenerateDividendComponent,
  },
  {
    path: 'monthly-profits',
    component: MonthlyProfitsComponent,
  },
];
