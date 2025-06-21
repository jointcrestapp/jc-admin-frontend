import { Component } from '@angular/core';
import { PageWrapperComponent } from '../../../shared/components/page-wrapper/page-wrapper.component';
import { FormSavingsComponent } from '../savings-form/form-savings.component';

@Component({
  selector: 'app-edit-savings',
  imports: [PageWrapperComponent, FormSavingsComponent],
  templateUrl: './edit-savings.component.html',
  styleUrl: './edit-savings.component.scss'
})
export class EditSavingsComponent {

}
