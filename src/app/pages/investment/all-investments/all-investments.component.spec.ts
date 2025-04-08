import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllInvestmentsComponent } from './all-investments.component';

describe('AllInvestmentsComponent', () => {
  let component: AllInvestmentsComponent;
  let fixture: ComponentFixture<AllInvestmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllInvestmentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllInvestmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
