import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DueLoanPaymentComponent } from "./due-loan-payment.component";

describe("DualLoanPaymentComponent", () => {
  let component: DueLoanPaymentComponent;
  let fixture: ComponentFixture<DueLoanPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DueLoanPaymentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DueLoanPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
