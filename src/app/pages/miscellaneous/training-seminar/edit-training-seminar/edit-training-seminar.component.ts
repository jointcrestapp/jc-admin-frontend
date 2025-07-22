import { Component } from "@angular/core";
import { PageWrapperComponent } from "src/app/shared/components/page-wrapper/page-wrapper.component";
import { FormTrainingSeminarComponent } from "../form-training-seminar/form-training-seminar.component";

@Component({
  selector: "app-edit-training-seminar",
  imports: [PageWrapperComponent, FormTrainingSeminarComponent],
  templateUrl: "./edit-training-seminar.component.html",
  styleUrl: "./edit-training-seminar.component.scss",
})
export class EditTrainingSeminarComponent {}
