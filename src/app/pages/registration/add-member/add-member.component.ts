import { Component } from '@angular/core';
import { PageWrapperComponent } from '../../../shared/components/page-wrapper/page-wrapper.component';
import { FormMemberComponent } from '../form-member/form-member.component';

@Component({
  selector: 'app-add-member',
  imports: [PageWrapperComponent, FormMemberComponent],
  templateUrl: './add-member.component.html',
  styleUrl: './add-member.component.scss'
})
export class AddMemberComponent {

}
