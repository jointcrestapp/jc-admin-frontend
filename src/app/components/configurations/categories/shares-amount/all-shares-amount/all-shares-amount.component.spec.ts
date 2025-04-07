import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllSharesAmountComponent } from './all-shares-amount.component';

describe('AllSharesAmountComponent', () => {
  let component: AllSharesAmountComponent;
  let fixture: ComponentFixture<AllSharesAmountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllSharesAmountComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllSharesAmountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
