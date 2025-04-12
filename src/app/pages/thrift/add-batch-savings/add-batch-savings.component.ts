import { Component } from '@angular/core';
import { PageWrapperComponent } from '../../../shared/components/page-wrapper/page-wrapper.component';
import { FormProductComponent } from '../savings-form/form-product.component';


@Component({
  selector: 'app-add-batch-savings',
  imports: [PageWrapperComponent, FormProductComponent],
  templateUrl: './add-batch-savings.component.html',
  styleUrl: './add-batch-savings.component.scss'
})
export class AddBatchSavingsComponent {

}
