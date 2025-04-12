
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
    path: '',
    component: AllByeLawsComponent
  },
  {
    path: 'add_bye_law',
    component: AddByeLawComponent
  },
  {
    path: 'edit_bye_law:/id',
    component: EditByeLawComponent
  },
  {
    path: 'minutes',
    component: AllMinutesComponent
  },
  {
    path: 'add_minute',
    component: AddMinuteComponent
  },
  {
    path: 'edit_minute',
    component: AditMinuteComponent
  },
  {
    path: 'training_seminar',
    component: AllTrainingSeminarComponent
  },
  {
    path: 'add_training_seminar',
    component: AddTrainingSeminarComponent
  },
  {
    path: 'edit_training_seminar',
    component: EditTrainingSeminarComponent
  },
];
