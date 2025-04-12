
import { Routes } from '@angular/router';
import { AllAgentsComponent } from './agents/all-agents/all-agents.component';
import { AddAgentComponent } from './agents/add-agent/add-agent.component';
import { EditAgentComponent } from './agents/edit-agent/edit-agent.component';
import { AllTransactionsComponent } from './transaction/all-transactions/all-transactions.component';







export const agentRoutes: Routes = [
  {
    path: '',
    component: AllAgentsComponent
  },
  {
    path: 'add_agent',
    component: AddAgentComponent
  },
  {
    path: 'edit_agent',
    component: EditAgentComponent
  },
  {
    path: 'transaction',
    component: AllTransactionsComponent
  },
];
