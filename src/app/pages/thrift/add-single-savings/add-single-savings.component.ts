import { Component } from '@angular/core';
import { PageWrapperComponent } from '../../../shared/components/page-wrapper/page-wrapper.component';
import { FormProductComponent } from '../savings-form/form-product.component';

@Component({
  selector: 'app-add-single-savings',
  imports: [PageWrapperComponent, FormProductComponent],
  templateUrl: './add-single-savings.component.html',
  styleUrl: './add-single-savings.component.scss'
})
export class AddSingleSavingsComponent {

}
