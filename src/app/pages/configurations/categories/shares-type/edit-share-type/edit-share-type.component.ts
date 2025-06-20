import { Component } from "@angular/core";
import { PageWrapperComponent } from "src/app/shared/components/page-wrapper/page-wrapper.component";
import { FormShareTypeComponent } from "../share-type-form/form-share-type.component";

@Component({
  selector: "app-edit-share-type",
  imports: [PageWrapperComponent, FormShareTypeComponent],
  templateUrl: "./edit-share-type.component.html",
  styleUrl: "./edit-share-type.component.scss",
})
export class EditShareTypeComponent {}
