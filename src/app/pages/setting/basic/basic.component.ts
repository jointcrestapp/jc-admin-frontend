import { Component } from "@angular/core";
import { PageWrapperComponent } from "src/app/shared/components/page-wrapper/page-wrapper.component";
import { FormBasicComponent } from "../form-basic/form-basic.component";

@Component({
  selector: "app-basic",
  imports: [PageWrapperComponent, FormBasicComponent],
  templateUrl: "./basic.component.html",
  styleUrl: "./basic.component.scss",
})
export class BasicComponent {}
