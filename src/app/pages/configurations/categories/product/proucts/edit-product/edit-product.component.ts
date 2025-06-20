import { Component } from "@angular/core";
import { PageWrapperComponent } from "src/app/shared/components/page-wrapper/page-wrapper.component";
import { FormProductComponent } from "../product-form/form-product.component";

@Component({
  selector: "app-edit-product",
  imports: [PageWrapperComponent, FormProductComponent],
  templateUrl: "./edit-product.component.html",
  styleUrl: "./edit-product.component.scss",
})
export class EditProductComponent {}
