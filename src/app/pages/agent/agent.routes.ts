
import { Routes } from '@angular/router';
import { AgentsComponent } from './agents/agents.component';
import { AddAgentComponent } from './agents/add-agent/add-agent.component';
import { EditAgentComponent } from './agents/edit-agent/edit-agent.component';
import { AllTransactionsComponent } from './transaction/all-transactions/all-transactions.component';

export const agentRoutes: Routes = [
  {
    path: '',
    component: AgentsComponent
  },
  {
    path: 'transaction',
    component: AllTransactionsComponent
  },
];
