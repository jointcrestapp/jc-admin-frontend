import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInvestmentTypeComponent } from './add-investment-type.component';

describe('AddInvestmentTypeComponent', () => {
  let component: AddInvestmentTypeComponent;
  let fixture: ComponentFixture<AddInvestmentTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddInvestmentTypeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddInvestmentTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
