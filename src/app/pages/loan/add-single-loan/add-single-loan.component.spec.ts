import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSingleLoanComponent } from './add-single-loan.component';

describe('AddSingleLoanComponent', () => {
  let component: AddSingleLoanComponent;
  let fixture: ComponentFixture<AddSingleLoanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSingleLoanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSingleLoanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
