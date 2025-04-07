import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDividendPercentComponent } from './edit-dividend-percent.component';

describe('EditDividendPercentComponent', () => {
  let component: EditDividendPercentComponent;
  let fixture: ComponentFixture<EditDividendPercentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditDividendPercentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditDividendPercentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
