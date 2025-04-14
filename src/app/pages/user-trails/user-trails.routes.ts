
import { Routes } from '@angular/router';
import { UsersActivitiesComponent } from './users-activities/users-activities.component';
import { UsersLoginComponent } from './users-login/users-login.component';

export const userTrialsRoutes: Routes = [
  {
    path: '',
    component: UsersActivitiesComponent
  },
  {
    path: 'user-activities',
    component: UsersActivitiesComponent
  },
  {
    path: 'users-login',
    component: UsersLoginComponent
  }
];
