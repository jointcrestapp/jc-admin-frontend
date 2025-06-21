import { Component } from "@angular/core";
import { PageWrapperComponent } from "src/app/shared/components/page-wrapper/page-wrapper.component";
import { FormUserRoleComponent } from "../user-role-form/form-user-role.component";

@Component({
  selector: "app-edit-user-role",
  imports: [PageWrapperComponent, FormUserRoleComponent],
  templateUrl: "./edit-user-role.component.html",
  styleUrl: "./edit-user-role.component.scss",
})
export class EditUserRoleComponent {}
