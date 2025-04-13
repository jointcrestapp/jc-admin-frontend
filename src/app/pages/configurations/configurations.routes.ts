
import { Routes } from '@angular/router';

import { AllUsersRolesComponent } from './users-role/all-users-roles/all-users-roles.component';
import { CategoriesComponent } from './categories/categories.component';

export const configurationRoutes: Routes = [
  {
    path: 'categories',
    component: CategoriesComponent
  },
  {
    path: 'users-role',
    component: AllUsersRolesComponent
  }
];
