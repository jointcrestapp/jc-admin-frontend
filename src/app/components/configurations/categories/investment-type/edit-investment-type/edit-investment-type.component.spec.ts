import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditInvestmentTypeComponent } from './edit-investment-type.component';

describe('EditInvestmentTypeComponent', () => {
  let component: EditInvestmentTypeComponent;
  let fixture: ComponentFixture<EditInvestmentTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditInvestmentTypeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditInvestmentTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
