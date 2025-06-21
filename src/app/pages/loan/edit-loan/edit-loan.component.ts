import { Component } from '@angular/core';
import { PageWrapperComponent } from '../../../shared/components/page-wrapper/page-wrapper.component';
import { FormLoanComponent } from '../loan-form/form-loan.component';



@Component({
  selector: 'app-edit-loan',
  imports: [PageWrapperComponent, FormLoanComponent],
  templateUrl: './edit-loan.component.html',
  styleUrl: './edit-loan.component.scss'
})
export class EditLoanComponent {

}
