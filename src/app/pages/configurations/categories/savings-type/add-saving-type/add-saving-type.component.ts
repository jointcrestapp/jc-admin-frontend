import { Component } from "@angular/core";
import { PageWrapperComponent } from "src/app/shared/components/page-wrapper/page-wrapper.component";
import { FormSavingsTypeComponent } from "../savings-type-form/form-savings-type.component";

@Component({
  selector: "app-add-saving-type",
  imports: [PageWrapperComponent, FormSavingsTypeComponent],
  templateUrl: "./add-saving-type.component.html",
  styleUrl: "./add-saving-type.component.scss",
})
export class AddSavingTypeComponent {}
