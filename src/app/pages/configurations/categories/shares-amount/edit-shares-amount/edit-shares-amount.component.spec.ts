import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSharesAmountComponent } from './edit-shares-amount.component';

describe('EditSharesAmountComponent', () => {
  let component: EditSharesAmountComponent;
  let fixture: ComponentFixture<EditSharesAmountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditSharesAmountComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditSharesAmountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
