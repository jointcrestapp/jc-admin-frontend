import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditInvestmentComponent } from './edit-investment.component';

describe('EditInvestmentComponent', () => {
  let component: EditInvestmentComponent;
  let fixture: ComponentFixture<EditInvestmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditInvestmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditInvestmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
