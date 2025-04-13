
import { Routes } from '@angular/router';
import { DividendHistoryComponent } from './dividend-history/dividend-history.component';
import { GenerateDividendComponent } from './generate-dividend/generate-dividend.component';


export const dividendRoutes: Routes = [
  {
    path: '',
    component: DividendHistoryComponent
  },
  {
    path: 'dividend-history',
    component: DividendHistoryComponent
  },
  {
    path: 'generate-dividend',
    component: GenerateDividendComponent
  }
];
