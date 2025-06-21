import { Component } from '@angular/core';
import { PageWrapperComponent } from '../../../shared/components/page-wrapper/page-wrapper.component';
import { BatchFormSavingsComponent } from '../bacth-savings-form/batch-form-savings.component';


@Component({
  selector: 'app-add-batch-savings',
  imports: [PageWrapperComponent, BatchFormSavingsComponent],
  templateUrl: './add-batch-savings.component.html',
  styleUrl: './add-batch-savings.component.scss'
})
export class AddBatchSavingsComponent {

}
