import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllSubscriptionFeeComponent } from './all-subscription-fee.component';

describe('AllSubscriptionFeeComponent', () => {
  let component: AllSubscriptionFeeComponent;
  let fixture: ComponentFixture<AllSubscriptionFeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllSubscriptionFeeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllSubscriptionFeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
