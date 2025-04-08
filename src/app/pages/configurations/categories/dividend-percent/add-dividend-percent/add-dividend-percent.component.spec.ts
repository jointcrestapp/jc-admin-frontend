import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDividendPercentComponent } from './add-dividend-percent.component';

describe('AddDividendPercentComponent', () => {
  let component: AddDividendPercentComponent;
  let fixture: ComponentFixture<AddDividendPercentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddDividendPercentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddDividendPercentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
