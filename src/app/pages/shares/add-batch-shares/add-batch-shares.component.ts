import { Component } from '@angular/core';
import { PageWrapperComponent } from '../../../shared/components/page-wrapper/page-wrapper.component';
import { BatchFormSharesComponent } from '../batch-shares-form/batch-form-shares.component';

@Component({
  selector: 'app-add-batch-shares',
  imports: [PageWrapperComponent, BatchFormSharesComponent],
  templateUrl: './add-batch-shares.component.html',
  styleUrl: './add-batch-shares.component.scss'
})
export class AddBatchSharesComponent {

}
