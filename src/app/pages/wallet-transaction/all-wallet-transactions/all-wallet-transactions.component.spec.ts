import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllWalletTransactionsComponent } from './all-wallet-transactions.component';

describe('AllWalletTransactionsComponent', () => {
  let component: AllWalletTransactionsComponent;
  let fixture: ComponentFixture<AllWalletTransactionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllWalletTransactionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllWalletTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
