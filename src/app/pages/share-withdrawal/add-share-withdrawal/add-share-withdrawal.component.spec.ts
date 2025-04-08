import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddShareWithdrawalComponent } from './add-share-withdrawal.component';

describe('AddShareWithdrawalComponent', () => {
  let component: AddShareWithdrawalComponent;
  let fixture: ComponentFixture<AddShareWithdrawalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddShareWithdrawalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddShareWithdrawalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
