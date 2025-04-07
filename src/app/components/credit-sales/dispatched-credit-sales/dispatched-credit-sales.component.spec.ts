import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatchedCreditSalesComponent } from './dispatched-credit-sales.component';

describe('DispatchedCreditSalesComponent', () => {
  let component: DispatchedCreditSalesComponent;
  let fixture: ComponentFixture<DispatchedCreditSalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DispatchedCreditSalesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DispatchedCreditSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
