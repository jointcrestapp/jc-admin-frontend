import { Component } from "@angular/core";
import { PageWrapperComponent } from "src/app/shared/components/page-wrapper/page-wrapper.component";
import { FormSavingsTypeComponent } from "../savings-type-form/form-savings-type.component";

@Component({
  selector: "app-edit-saving-type",
  imports: [PageWrapperComponent, FormSavingsTypeComponent],
  templateUrl: "./edit-saving-type.component.html",
  styleUrl: "./edit-saving-type.component.scss",
})
export class EditSavingTypeComponent {}
