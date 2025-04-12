
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
    path: 'add_withdrawal',
    component: AddWithdrawalComponent
  },
  {
    path: 'pending_withdrawal',
    component: PendingWithdrawalsComponent
  },
  {
    path: 'batch_withdrawals',
    component: BatchWithdrawalComponent
  },
  {
    path: 'edit_withdrawal:/id',
    component: EditWithdrawalComponent
  }
];
