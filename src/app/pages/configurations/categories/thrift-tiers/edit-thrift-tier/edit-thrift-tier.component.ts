import { Component } from "@angular/core";
import { PageWrapperComponent } from "src/app/shared/components/page-wrapper/page-wrapper.component";
import { FormThriftTierComponent } from "./../thrift-tier-form/form-thrift-tier.component";

@Component({
  selector: "app-edit-thrift-tier",
  imports: [PageWrapperComponent, FormThriftTierComponent],
  templateUrl: "./edit-thrift-tier.component.html",
  styleUrl: "./edit-thrift-tier.component.scss",
})
export class EditThriftTierComponent {}
