import { Component } from '@angular/core';
import { PageWrapperComponent } from '../../../shared/components/page-wrapper/page-wrapper.component';
import { FormThriftComponent } from '../thrift-form/form-thrift.component';

@Component({
  selector: 'app-add-thrift',
  imports: [PageWrapperComponent, FormThriftComponent],
  templateUrl: './add-thrift.component.html',
  styleUrl: './add-thrift.component.scss'
})
export class AddThriftComponent {

}
