import { Component } from '@angular/core';
import { PageWrapperComponent } from '../../../shared/components/page-wrapper/page-wrapper.component';
import { FormSharesComponent } from '../shares-form/form-shares.component';


@Component({
  selector: 'app-add-single-share',
  imports: [PageWrapperComponent, FormSharesComponent],
  templateUrl: './add-single-share.component.html',
  styleUrl: './add-single-share.component.scss'
})
export class AddSingleShareComponent {

}
