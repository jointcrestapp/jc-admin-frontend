import { Component } from "@angular/core";
import { PageWrapperComponent } from "src/app/shared/components/page-wrapper/page-wrapper.component";
import { FormShareTypeComponent } from "./../share-type-form/form-share-type.component";

@Component({
  selector: "app-add-share-type",
  imports: [PageWrapperComponent, FormShareTypeComponent],
  templateUrl: "./add-share-type.component.html",
  styleUrl: "./add-share-type.component.scss",
})
export class AddShareTypeComponent {}
