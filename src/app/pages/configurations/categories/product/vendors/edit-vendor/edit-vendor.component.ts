import { Component } from "@angular/core";
import { PageWrapperComponent } from "src/app/shared/components/page-wrapper/page-wrapper.component";
import { FormVendorComponent } from "./../vendor-form/form-vendor.component";

@Component({
  selector: "app-edit-vendor",
  imports: [PageWrapperComponent, FormVendorComponent],
  templateUrl: "./edit-vendor.component.html",
  styleUrl: "./edit-vendor.component.scss",
})
export class EditVendorComponent {}
