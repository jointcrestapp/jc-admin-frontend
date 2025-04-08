import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditSalesReportComponent } from './credit-sales-report.component';

describe('CreditSalesReportComponent', () => {
  let component: CreditSalesReportComponent;
  let fixture: ComponentFixture<CreditSalesReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreditSalesReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditSalesReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
