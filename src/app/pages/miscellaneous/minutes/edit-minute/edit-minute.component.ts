import { Component } from "@angular/core";
import { PageWrapperComponent } from "src/app/shared/components/page-wrapper/page-wrapper.component";
import { FormMinuteComponent } from "../form-minute/form-minute.component";

@Component({
  selector: "app-edit-minute",
  imports: [PageWrapperComponent, FormMinuteComponent],
  templateUrl: "./edit-minute.component.html",
  styleUrl: "./edit-minute.component.scss",
})
export class EditMinuteComponent {}
