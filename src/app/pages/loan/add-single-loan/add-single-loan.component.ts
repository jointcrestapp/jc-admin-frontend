import { Component } from '@angular/core';
import { PageWrapperComponent } from '../../../shared/components/page-wrapper/page-wrapper.component';
import { FormLoanComponent } from '../loan-form/form-loan.component';


@Component({
  selector: 'app-add-single-loan',
  imports: [PageWrapperComponent, FormLoanComponent],
  templateUrl: './add-single-loan.component.html',
  styleUrl: './add-single-loan.component.scss'
})
export class AddSingleLoanComponent {

}
