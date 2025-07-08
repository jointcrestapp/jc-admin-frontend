import { Component } from "@angular/core";
import { PageWrapperComponent } from "src/app/shared/components/page-wrapper/page-wrapper.component";
import { FormOthersComponent } from "../form-others/form-others.component";

@Component({
  selector: "app-others",
  imports: [PageWrapperComponent, FormOthersComponent],
  templateUrl: "./others.component.html",
  styleUrl: "./others.component.scss",
})
export class OthersComponent {}
