
import { Routes } from '@angular/router';
import { AllMembersComponent } from './all-members/all-members.component';
import { EditMemberComponent } from './edit-member/edit-member.component';
import { AddMemberComponent } from './add-member/add-member.component';
import { ExitedMembersComponent } from './exited-members/exited-members.component';
import { PendingMembersComponent } from './pending-members/pending-members.component';
import { AccountClosureRequestComponent } from './account-closure-request/account-closure-request.component';
import { KycSubmissionsComponent } from './kyc-submissions/kyc-submissions.component';

export const registrationRoutes: Routes = [
  {
    path: '',
    component: AllMembersComponent
  },
  {
    path: 'all-members',
    component: AllMembersComponent
  },
  {
    path: 'create',
    component: AddMemberComponent
  },
  {
    path: 'exited-members',
    component: ExitedMembersComponent
  },
  {
    path: 'pending-members',
    component: PendingMembersComponent
  },
  {
    path: 'account-closure-request',
    component: AccountClosureRequestComponent
  },
  {
    path: 'edit-member/:id',
    component: EditMemberComponent
  },
  {
    path: 'kyc-submissions',
    component: KycSubmissionsComponent
  },
];
