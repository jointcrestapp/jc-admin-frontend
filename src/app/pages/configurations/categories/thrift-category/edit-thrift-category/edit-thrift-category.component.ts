import { Component } from "@angular/core";
import { PageWrapperComponent } from "src/app/shared/components/page-wrapper/page-wrapper.component";
import { FormThriftCategoryComponent } from "../thrift-category-form/form-thrift-category.component";

@Component({
  selector: "app-edit-thrift-category",
  imports: [PageWrapperComponent, FormThriftCategoryComponent],
  templateUrl: "./edit-thrift-category.component.html",
  styleUrl: "./edit-thrift-category.component.scss",
})
export class EditThriftCategoryComponent {}
