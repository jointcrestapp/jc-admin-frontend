import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinishedLoansComponent } from './finished-loans.component';

describe('FinishedLoansComponent', () => {
  let component: FinishedLoansComponent;
  let fixture: ComponentFixture<FinishedLoansComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinishedLoansComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinishedLoansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
