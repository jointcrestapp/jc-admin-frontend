
import { Routes } from '@angular/router';
import { AllByeLawsComponent } from './bye-law/all-bye-laws/all-bye-laws.component';
import { AddByeLawComponent } from './bye-law/add-bye-law/add-bye-law.component';
import { EditByeLawComponent } from './bye-law/edit-bye-law/edit-bye-law.component';
import { AllMinutesComponent } from './minutes/all-minutes/all-minutes.component';
import { AddMinuteComponent } from './minutes/add-minute/add-minute.component';
import { AditMinuteComponent } from './minutes/edit-minute/adit-minute.component';
import { AllTrainingSeminarComponent } from './training-seminar/all-minutes/all-minutes.component';
import { AddTrainingSeminarComponent } from './training-seminar/add-minute/add-minute.component';
import { EditTrainingSeminarComponent } from './training-seminar/edit-minute/edit-minute.component';






export const miscellaneousRoutes: Routes = [
  {
    path: 'bye-law',
    component: AllByeLawsComponent
  },
  {
    path: 'add-bye-law',
    component: AddByeLawComponent
  },
  {
    path: 'edit-bye-law:/id',
    component: EditByeLawComponent
  },
  {
    path: 'minutes',
    component: AllMinutesComponent
  },
  {
    path: 'add-minute',
    component: AddMinuteComponent
  },
  {
    path: 'edit-minute',
    component: AditMinuteComponent
  },
  {
    path: 'training-seminar',
    component: AllTrainingSeminarComponent
  },
  {
    path: 'add-training-seminar',
    component: AddTrainingSeminarComponent
  },
  {
    path: 'edit-training-seminar',
    component: EditTrainingSeminarComponent
  },
];
