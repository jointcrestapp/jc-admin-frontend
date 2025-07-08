import { Component } from "@angular/core";
import { PageWrapperComponent } from "src/app/shared/components/page-wrapper/page-wrapper.component";
import { FormTrainingSeminarComponent } from "../form-training-seminar/form-training-seminar.component";

@Component({
  selector: "app-add-training-seminar",
  imports: [PageWrapperComponent, FormTrainingSeminarComponent],
  templateUrl: "./add-training-seminar.component.html",
  styleUrl: "./add-training-seminar.component.scss",
})
export class AddTrainingSeminarComponent {}
