import { Component } from '@angular/core';
import { PageWrapperComponent } from '../../../shared/components/page-wrapper/page-wrapper.component';
import { FormProductComponent } from '../savings-form/form-product.component';

@Component({
  selector: 'app-edit-savings',
  imports: [PageWrapperComponent, FormProductComponent],
  templateUrl: './edit-savings.component.html',
  styleUrl: './edit-savings.component.scss'
})
export class EditSavingsComponent {

}
