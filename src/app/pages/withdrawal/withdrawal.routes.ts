
import { Routes } from '@angular/router';
import { WithdrawalComponent } from './withdrawal.component';
import { AddWithdrawalComponent } from './add-withdrawal/add-withdrawal.component';
import { PendingWithdrawalsComponent } from './pending-withdrawals/pending-withdrawals.component';
import { BatchWithdrawalComponent } from './batch-withdrawal/batch-withdrawal.component';
import { EditWithdrawalComponent } from './edit-withdrawal/edit-withdrawal.component';

export const withdrawalRoutes: Routes = [
  {
    path: '',
    component: WithdrawalComponent
  },
  {
    path: 'add-withdrawal',
    component: AddWithdrawalComponent
  },
  {
    path: 'pending-withdrawal',
    component: PendingWithdrawalsComponent
  },
  {
    path: 'batch-withdrawal',
    component: BatchWithdrawalComponent
  },
  {
    path: 'edit-withdrawal:/id',
    component: EditWithdrawalComponent
  }
];
