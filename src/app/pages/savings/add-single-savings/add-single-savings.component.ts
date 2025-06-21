import { Component } from '@angular/core';
import { PageWrapperComponent } from '../../../shared/components/page-wrapper/page-wrapper.component';
import { FormSavingsComponent } from '../savings-form/form-savings.component';

@Component({
  selector: 'app-add-single-savings',
  imports: [PageWrapperComponent, FormSavingsComponent],
  templateUrl: './add-single-savings.component.html',
  styleUrl: './add-single-savings.component.scss'
})
export class AddSingleSavingsComponent {

}
