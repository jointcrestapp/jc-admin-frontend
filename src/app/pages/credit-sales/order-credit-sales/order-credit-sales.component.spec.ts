import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderCreditSalesComponent } from './order-credit-sales.component';

describe('OrderCreditSalesComponent', () => {
  let component: OrderCreditSalesComponent;
  let fixture: ComponentFixture<OrderCreditSalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderCreditSalesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderCreditSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
