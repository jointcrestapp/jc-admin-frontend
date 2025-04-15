import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountClosureRequestComponent } from './account-closure-request.component';

describe('AccountClosureRequestComponent', () => {
  let component: AccountClosureRequestComponent;
  let fixture: ComponentFixture<AccountClosureRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountClosureRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountClosureRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
