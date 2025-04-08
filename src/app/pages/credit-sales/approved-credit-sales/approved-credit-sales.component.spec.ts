import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedCreditSalesComponent } from './approved-credit-sales.component';

describe('ApprovedCreditSalesComponent', () => {
  let component: ApprovedCreditSalesComponent;
  let fixture: ComponentFixture<ApprovedCreditSalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApprovedCreditSalesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovedCreditSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
