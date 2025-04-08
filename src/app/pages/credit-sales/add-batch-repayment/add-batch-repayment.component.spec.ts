import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBatchRepaymentComponent } from './add-batch-repayment.component';

describe('AddBatchRepaymentComponent', () => {
  let component: AddBatchRepaymentComponent;
  let fixture: ComponentFixture<AddBatchRepaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddBatchRepaymentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddBatchRepaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
