import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingShareWithdrawalsComponent } from './pending-share-withdrawals.component';

describe('PendingShareWithdrawalsComponent', () => {
  let component: PendingShareWithdrawalsComponent;
  let fixture: ComponentFixture<PendingShareWithdrawalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PendingShareWithdrawalsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PendingShareWithdrawalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
