import { Component } from "@angular/core";
import { PageWrapperComponent } from "../../../shared/components/page-wrapper/page-wrapper.component";
import { FormDividendComponent } from "../dividend-form/form-dividend.component";

@Component({
  selector: "app-generate-dividend",
  imports: [PageWrapperComponent, FormDividendComponent],
  templateUrl: "./generate-dividend.component.html",
  styleUrl: "./generate-dividend.component.scss",
})
export class GenerateDividendComponent {}
