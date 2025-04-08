import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllSharesTypeComponent } from './all-shares-type.component';

describe('AllSharesTypeComponent', () => {
  let component: AllSharesTypeComponent;
  let fixture: ComponentFixture<AllSharesTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllSharesTypeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllSharesTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
