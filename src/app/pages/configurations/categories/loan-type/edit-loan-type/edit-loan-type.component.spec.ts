import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLoanTypeComponent } from './edit-loan-type.component';

describe('EditLoanTypeComponent', () => {
  let component: EditLoanTypeComponent;
  let fixture: ComponentFixture<EditLoanTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditLoanTypeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditLoanTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
