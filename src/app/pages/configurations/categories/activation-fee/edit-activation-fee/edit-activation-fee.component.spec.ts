import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditActivationFeeComponent } from './edit-activation-fee.component';

describe('EditActivationFeeComponent', () => {
  let component: EditActivationFeeComponent;
  let fixture: ComponentFixture<EditActivationFeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditActivationFeeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditActivationFeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
