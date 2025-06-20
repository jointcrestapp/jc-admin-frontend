import { Component } from "@angular/core";
import { PageWrapperComponent } from "../../../../../shared/components/page-wrapper/page-wrapper.component";
import { FormThriftCategoryComponent } from "../thrift-category-form/form-thrift-category.component";

@Component({
  selector: "app-add-thrift-category",
  imports: [PageWrapperComponent, FormThriftCategoryComponent],
  templateUrl: "./add-thrift-category.component.html",
  styleUrl: "./add-thrift-category.component.scss",
})
export class AddThriftCategoryComponent {}
