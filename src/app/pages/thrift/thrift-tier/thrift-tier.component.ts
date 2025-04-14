import { Component } from '@angular/core';
import { PageWrapperComponent } from '../../../shared/components/page-wrapper/page-wrapper.component';
import { FormProductComponent } from '../savings-form/form-product.component';


@Component({
  selector: 'app-thrift-tier',
  imports: [PageWrapperComponent, FormProductComponent],
  templateUrl: './thrift-tier.component.html',
  styleUrl: './thrift-tier.component.scss'
})
export class ThriftTierComponent {

}
