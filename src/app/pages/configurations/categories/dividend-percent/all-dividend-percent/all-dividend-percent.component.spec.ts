import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllDividendPercentComponent } from './all-dividend-percent.component';

describe('AllDividendPercentComponent', () => {
  let component: AllDividendPercentComponent;
  let fixture: ComponentFixture<AllDividendPercentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllDividendPercentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllDividendPercentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
