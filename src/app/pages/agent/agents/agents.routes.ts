
import { Routes } from '@angular/router';
import { AddAgentComponent } from './add-agent/add-agent.component';
import { EditAgentComponent } from './edit-agent/edit-agent.component';

export const agentRoutes: Routes = [
  {
    path: 'add-agent',
    component: AddAgentComponent
  },
  {
    path: 'edit-agent:/id',
    component: EditAgentComponent
  },
];
