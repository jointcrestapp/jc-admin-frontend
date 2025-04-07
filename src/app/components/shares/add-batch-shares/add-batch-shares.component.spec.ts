import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBatchSharesComponent } from './add-batch-shares.component';

describe('AddBatchSharesComponent', () => {
  let component: AddBatchSharesComponent;
  let fixture: ComponentFixture<AddBatchSharesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddBatchSharesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddBatchSharesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
