import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllInvestmentTypesComponent } from './all-investment-types.component';

describe('AllInvestmentTypesComponent', () => {
  let component: AllInvestmentTypesComponent;
  let fixture: ComponentFixture<AllInvestmentTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllInvestmentTypesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllInvestmentTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
