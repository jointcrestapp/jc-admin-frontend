import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBatchSavingsComponent } from './add-batch-savings.component';

describe('AddBatchSavingsComponent', () => {
  let component: AddBatchSavingsComponent;
  let fixture: ComponentFixture<AddBatchSavingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddBatchSavingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddBatchSavingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
