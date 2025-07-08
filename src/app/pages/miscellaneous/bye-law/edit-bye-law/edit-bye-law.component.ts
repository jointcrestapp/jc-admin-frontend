import { Component } from "@angular/core";
import { PageWrapperComponent } from "src/app/shared/components/page-wrapper/page-wrapper.component";
import { FormByeLawComponent } from "../form-bye-law/form-bye-law.component";

@Component({
  selector: "app-edit-bye-law",
  imports: [PageWrapperComponent, FormByeLawComponent],
  templateUrl: "./edit-bye-law.component.html",
  styleUrl: "./edit-bye-law.component.scss",
})
export class EditByeLawComponent {}
