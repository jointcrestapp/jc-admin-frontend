import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditWithdrawalComponent } from './edit-withdrawal.component';

describe('EditWithdrawalComponent', () => {
  let component: EditWithdrawalComponent;
  let fixture: ComponentFixture<EditWithdrawalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditWithdrawalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditWithdrawalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
