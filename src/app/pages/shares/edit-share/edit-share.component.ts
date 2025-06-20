import { Component } from '@angular/core';
import { PageWrapperComponent } from '../../../shared/components/page-wrapper/page-wrapper.component';
import { FormSharesComponent } from '../shares-form/form-shares.component';


@Component({
  selector: 'app-edit-share',
  imports: [PageWrapperComponent, FormSharesComponent],
  templateUrl: './edit-share.component.html',
  styleUrl: './edit-share.component.scss'
})
export class EditShareComponent {

}
