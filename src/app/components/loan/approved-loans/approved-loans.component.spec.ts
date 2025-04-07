import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedLoansComponent } from './approved-loans.component';

describe('ApprovedLoansComponent', () => {
  let component: ApprovedLoansComponent;
  let fixture: ComponentFixture<ApprovedLoansComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApprovedLoansComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovedLoansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
