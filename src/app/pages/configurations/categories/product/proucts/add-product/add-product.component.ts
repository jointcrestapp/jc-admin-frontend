import { Component } from "@angular/core";
import { PageWrapperComponent } from "src/app/shared/components/page-wrapper/page-wrapper.component";
import { FormProductComponent } from "../product-form/form-product.component";

@Component({
  selector: "app-add-product",
  imports: [PageWrapperComponent, FormProductComponent],
  templateUrl: "./add-product.component.html",
  styleUrl: "./add-product.component.scss",
})
export class AddProductComponent {}
