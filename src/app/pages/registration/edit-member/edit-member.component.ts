import { Component } from '@angular/core';
import { PageWrapperComponent } from '../../../shared/components/page-wrapper/page-wrapper.component';
import { FormMemberComponent } from '../form-member/form-member.component';

@Component({
  selector: 'app-edit-member',
  imports: [PageWrapperComponent, FormMemberComponent],
  templateUrl: './edit-member.component.html',
  styleUrl: './edit-member.component.scss'
})
export class EditMemberComponent {

}
