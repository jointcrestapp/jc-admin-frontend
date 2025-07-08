import { Component } from "@angular/core";
import { PageWrapperComponent } from "src/app/shared/components/page-wrapper/page-wrapper.component";
import { FormByeLawComponent } from "../form-bye-law/form-bye-law.component";

@Component({
  selector: "app-add-bye-law",
  imports: [PageWrapperComponent, FormByeLawComponent],
  templateUrl: "./add-bye-law.component.html",
  styleUrl: "./add-bye-law.component.scss",
})
export class AddByeLawComponent {}
