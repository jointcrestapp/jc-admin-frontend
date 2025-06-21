import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBatchThriftComponent } from './add-batch-thrift.component';

describe('AddBatchSavingsComponent', () => {
  let component: AddBatchThriftComponent;
  let fixture: ComponentFixture<AddBatchThriftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddBatchThriftComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddBatchThriftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
