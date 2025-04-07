import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllActivationFeeComponent } from './all-activation-fee.component';

describe('AllActivationFeeComponent', () => {
  let component: AllActivationFeeComponent;
  let fixture: ComponentFixture<AllActivationFeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllActivationFeeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllActivationFeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
