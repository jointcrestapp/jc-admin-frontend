import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DualLoanPaymentComponent } from './dual-loan-payment.component';

describe('DualLoanPaymentComponent', () => {
  let component: DualLoanPaymentComponent;
  let fixture: ComponentFixture<DualLoanPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DualLoanPaymentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DualLoanPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
