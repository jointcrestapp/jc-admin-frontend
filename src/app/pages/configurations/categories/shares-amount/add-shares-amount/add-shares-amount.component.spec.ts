import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSharesAmountComponent } from './add-shares-amount.component';

describe('AddSharesAmountComponent', () => {
  let component: AddSharesAmountComponent;
  let fixture: ComponentFixture<AddSharesAmountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSharesAmountComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSharesAmountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
