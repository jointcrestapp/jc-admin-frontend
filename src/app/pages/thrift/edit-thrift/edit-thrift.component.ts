import { Component } from '@angular/core';
import { PageWrapperComponent } from '../../../shared/components/page-wrapper/page-wrapper.component';
import { FormThriftComponent } from '../thrift-form/form-thrift.component';

@Component({
  selector: 'app-edit-thrift',
  imports: [PageWrapperComponent, FormThriftComponent],
  templateUrl: './edit-thrift.component.html',
  styleUrl: './edit-thrift.component.scss'
})
export class EditThriftComponent {

}
