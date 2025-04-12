
import { Routes } from '@angular/router';
import { AddShareWithdrawalComponent } from './add-share-withdrawal/add-share-withdrawal.component';
import { AllShareWithdrawalsComponent } from './all-share-withdrawals/all-share-withdrawals.component';
import { EditShareWithdrawalComponent } from './edit-share-withdrawal/edit-share-withdrawal.component';
import { PendingShareWithdrawalsComponent } from './pending-share-withdrawals/pending-share-withdrawals.component';

export const shareWithdrawalRoutes: Routes = [
  {
    path: '',
    component: AllShareWithdrawalsComponent
  },
  {
    path: 'add_share_withdrawal',
    component: AddShareWithdrawalComponent
  },
  {
    path: 'pending_share_withdrawal',
    component: PendingShareWithdrawalsComponent
  },
  {
    path: 'edit_share_withdrawal:/id',
    component: EditShareWithdrawalComponent
  }
];
