import { Component } from "@angular/core";
import { PageWrapperComponent } from "src/app/shared/components/page-wrapper/page-wrapper.component";
import { FormUserRoleComponent } from "../user-role-form/form-user-role.component";

@Component({
  selector: "app-add-user-role",
  imports: [PageWrapperComponent, FormUserRoleComponent],
  templateUrl: "./add-user-role.component.html",
  styleUrl: "./add-user-role.component.scss",
})
export class AddUserRoleComponent {}
