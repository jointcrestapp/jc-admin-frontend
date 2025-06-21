import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { CurrencySymbolPipe } from '../../../shared/pipe/currency-symbol.pipe';

@Component({
    selector: 'app-details',
    imports: [CommonModule, TranslateModule, CurrencySymbolPipe, DatePipe],
    templateUrl: './details.component.html',
    styleUrl: './details.component.scss'
})
export class DetailsComponent {
  // Default dummy data
  @Input() savings: any = {
    transaction_id: 'SAV-2023-05678',
    amount: 5000.00,
    interest_rate: 3.5,
    created_at: new Date(),
    status: 'completed',
    type: 'fixed deposit',
    maturity_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    expected_interest: 175.00,
    total_at_maturity: 5175.00
  };

  @Input() member: any = {
    first_name: 'John',
    last_name: 'Doe',
    member_id: 'M-987654',
    address_line1: '123 Main Street',
    city: 'New York',
    state: 'NY',
    postal_code: '10001'
  };

  printSlip() {
    window.print();
  }

  closeSlip() {
    // This would be handled by the parent component
    console.log('Close slip clicked');
  }
}
