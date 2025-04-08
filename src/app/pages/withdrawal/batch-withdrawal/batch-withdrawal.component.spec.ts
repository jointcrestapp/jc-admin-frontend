import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchWithdrawalComponent } from './batch-withdrawal.component';

describe('BatchWithdrawalComponent', () => {
  let component: BatchWithdrawalComponent;
  let fixture: ComponentFixture<BatchWithdrawalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BatchWithdrawalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BatchWithdrawalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
