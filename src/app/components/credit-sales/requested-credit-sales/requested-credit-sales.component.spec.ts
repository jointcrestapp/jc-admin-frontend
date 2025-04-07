import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestedCreditSalesComponent } from './requested-credit-sales.component';

describe('RequestedCreditSalesComponent', () => {
  let component: RequestedCreditSalesComponent;
  let fixture: ComponentFixture<RequestedCreditSalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestedCreditSalesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestedCreditSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
