import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSubscriptionFeeComponent } from './edit-subscription-fee.component';

describe('EditSubscriptionFeeComponent', () => {
  let component: EditSubscriptionFeeComponent;
  let fixture: ComponentFixture<EditSubscriptionFeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditSubscriptionFeeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditSubscriptionFeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
