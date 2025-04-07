import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllWithdrawalsComponent } from './all-withdrawals.component';

describe('AllWithdrawalsComponent', () => {
  let component: AllWithdrawalsComponent;
  let fixture: ComponentFixture<AllWithdrawalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllWithdrawalsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllWithdrawalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
