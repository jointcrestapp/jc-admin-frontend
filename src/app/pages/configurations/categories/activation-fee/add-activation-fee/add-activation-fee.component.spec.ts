import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddActivationFeeComponent } from './add-activation-fee.component';

describe('AddActivationFeeComponent', () => {
  let component: AddActivationFeeComponent;
  let fixture: ComponentFixture<AddActivationFeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddActivationFeeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddActivationFeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
