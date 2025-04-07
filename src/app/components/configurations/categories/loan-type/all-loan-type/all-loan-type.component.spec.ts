import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllLoanTypeComponent } from './all-loan-type.component';

describe('AllLoanTypeComponent', () => {
  let component: AllLoanTypeComponent;
  let fixture: ComponentFixture<AllLoanTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllLoanTypeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllLoanTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
