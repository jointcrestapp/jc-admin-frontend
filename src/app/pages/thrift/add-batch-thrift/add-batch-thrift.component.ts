import { Component } from '@angular/core';
import { PageWrapperComponent } from '../../../shared/components/page-wrapper/page-wrapper.component';
import { BatchFormThriftComponent } from '../batch-thrift-form/batch-form-thrift.component';


@Component({
  selector: 'app-thrift-batch',
  imports: [PageWrapperComponent, BatchFormThriftComponent],
  templateUrl: './add-batch-thrift.component.html',
  styleUrl: './add-batch-thrift.component.scss'
})
export class AddBatchThriftComponent {

}
