import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LedgerBalanceComponent } from './ledger-balance.component';

describe('LedgerBalanceComponent', () => {
  let component: LedgerBalanceComponent;
  let fixture: ComponentFixture<LedgerBalanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LedgerBalanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LedgerBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
