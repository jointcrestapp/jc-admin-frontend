import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLoanTypeComponent } from './add-loan-type.component';

describe('AddLoanTypeComponent', () => {
  let component: AddLoanTypeComponent;
  let fixture: ComponentFixture<AddLoanTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddLoanTypeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddLoanTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
