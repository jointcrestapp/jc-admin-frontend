
import { Routes } from '@angular/router';

import { UserComponent } from './user.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { CreateRoleComponent } from './role/create-role/create-role.component';
import { EditRoleComponent } from './role/edit-role/edit-role.component';
import { PermissionsComponent } from './role/permissions/permissions.component';
import { RoleComponent } from './role/role.component';
import { UserDetailComponent } from './user-detail/user-detail.component';

export const userRoutes: Routes = [
  {
    path: "all-users",
    component: UserComponent
  },
  {
    path: "create",
    component: CreateUserComponent
  },
  {
    path: "edit/:id",
    component: EditUserComponent
  },
  {
    path: "detail/:id",
    component: UserDetailComponent
  },
  {
    path: "create-role",
    component: CreateRoleComponent
  },
  {
    path: "edit-role/:id",
    component: EditRoleComponent
  },
  {
    path: "role",
    component: RoleComponent
  },
  {
    path: "permissions",
    component: PermissionsComponent
  }
];
