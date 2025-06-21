import { Routes } from "@angular/router";
import { AddUserRoleComponent } from "./add-user-role/add-user-role.component";
import { EditUserRoleComponent } from "./edit-user-role/edit-user-role.component";
import { AllUsersRolesComponent } from "./all-users-roles/all-users-roles.component";

export const userRolesTypeRoutes: Routes = [
  {
    path: "",
    component: AllUsersRolesComponent,
  },
  {
    path: "add-user-role",
    component: AddUserRoleComponent,
  },
  {
    path: "edit-user-role/:id",
    component: EditUserRoleComponent,
  },
];
