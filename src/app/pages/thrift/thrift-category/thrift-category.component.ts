import { Component } from '@angular/core';
import { PageWrapperComponent } from '../../../shared/components/page-wrapper/page-wrapper.component';
import { FormProductComponent } from '../savings-form/form-product.component';

@Component({
  selector: 'app-thrift-category',
  imports: [PageWrapperComponent, FormProductComponent],
  templateUrl: './thrift-category.component.html',
  styleUrl: './thrift-category.component.scss'
})
export class ThriftCategoryComponent {

}
