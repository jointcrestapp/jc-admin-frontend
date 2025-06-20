import { Component } from "@angular/core";
import { PageWrapperComponent } from "src/app/shared/components/page-wrapper/page-wrapper.component";
import { FormVendorComponent } from "./../vendor-form/form-vendor.component";

@Component({
  selector: "app-add-vendor",
  imports: [PageWrapperComponent, FormVendorComponent],
  templateUrl: "./add-vendor.component.html",
  styleUrl: "./add-vendor.component.scss",
})
export class AddVendorComponent {}
