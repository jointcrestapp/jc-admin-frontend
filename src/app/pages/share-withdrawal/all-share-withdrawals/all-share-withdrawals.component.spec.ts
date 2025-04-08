import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllShareWithdrawalsComponent } from './all-share-withdrawals.component';

describe('AllShareWithdrawalsComponent', () => {
  let component: AllShareWithdrawalsComponent;
  let fixture: ComponentFixture<AllShareWithdrawalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllShareWithdrawalsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllShareWithdrawalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
