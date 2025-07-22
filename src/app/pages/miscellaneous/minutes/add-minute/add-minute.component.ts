import { Component } from "@angular/core";
import { PageWrapperComponent } from "src/app/shared/components/page-wrapper/page-wrapper.component";
import { FormMinuteComponent } from "../form-minute/form-minute.component";

@Component({
  selector: "app-add-minute",
  imports: [PageWrapperComponent, FormMinuteComponent],
  templateUrl: "./add-minute.component.html",
  styleUrl: "./add-minute.component.scss",
})
export class AddMinuteComponent {}
