import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Store } from '@ngxs/store';
import { map, Observable, of } from 'rxjs';
import { PageWrapperComponent } from 'src/app/shared/components/page-wrapper/page-wrapper.component';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { LoanState } from 'src/app/shared/store/state/loan.state';
import { appConfig } from 'src/app/core/config/config';

@Component({
  selector: 'app-loan-detail',
  templateUrl: './loan-detail.component.html',
  styleUrl: './loan-detail.component.scss',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, PageWrapperComponent],
})
export class LoanDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private store = inject(Store);
  
  loan$: Observable<any>;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    const cat = this.route.snapshot.paramMap.get('cat');
    const loanCats = appConfig.loan_components;

    let selector: Observable<any>;

    // Determine which State selector to use based on the category param
    switch (cat) {
        case loanCats.REQUESTED_LOAN:
          selector = this.store.select(LoanState.request_loans);
          break;
      case loanCats.APPROVED_LOAN:
        selector = this.store.select(LoanState.approved_loans);
        break;
      case loanCats.DISBURSED_LOAN:
        selector = this.store.select(LoanState.disbursed_loans);
        break;
      case loanCats.FINISHED_LOAN:
        selector = this.store.select(LoanState.finished_loans);
        break;
      case loanCats.DUE_LOAN_REPAYMENT:
        selector = this.store.select(LoanState.due_loans);
        break;
      default:
        selector = this.store.select(LoanState.request_loans);
        break;
    }

    this.loan$ = selector.pipe(
      map(result => {
        const dataArray = result?.data || [];
        console.log('DATA>>>', dataArray);
        
        return dataArray.find((m: any) => m.id == id);
      })
    );
  }

  getStatusLabel(status: number): string {
    const labels: Record<number, string> = {
      0: 'Waiting for Approval',
      1: 'Approved',
      2: 'Active (Disbursed)',
      3: 'Fully Repaid',
      4: 'Rejected',
      5: 'Defaulted'
    };
    return labels[status] || 'Unknown';
  }

  getStatusClass(status: number): string {
    const classes: Record<number, string> = {
      0: 'bg-warning-light text-warning',
      1: 'bg-info-light text-info',
      2: 'bg-primary-light text-primary',
      3: 'bg-success-light text-success',
      4: 'bg-danger-light text-danger'
    };
    return classes[status] || 'bg-secondary text-white';
  }
}