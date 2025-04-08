import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditShareWithdrawalComponent } from './edit-share-withdrawal.component';

describe('EditShareWithdrawalComponent', () => {
  let component: EditShareWithdrawalComponent;
  let fixture: ComponentFixture<EditShareWithdrawalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditShareWithdrawalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditShareWithdrawalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
