import { Component } from '@angular/core';
import { PageWrapperComponent } from '../../../shared/components/page-wrapper/page-wrapper.component';
import { FormWithdrawalComponent } from '../withdrawal-form/form-withdrawal.component';

@Component({
  selector: 'app-add-withdrawal',
  imports: [PageWrapperComponent, FormWithdrawalComponent],
  templateUrl: './add-withdrawal.component.html',
  styleUrl: './add-withdrawal.component.scss'
})
export class AddWithdrawalComponent {

}
