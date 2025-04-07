import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllSavingTypesComponent } from './all-saving-types.component';

describe('AllSavingTypesComponent', () => {
  let component: AllSavingTypesComponent;
  let fixture: ComponentFixture<AllSavingTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllSavingTypesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllSavingTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
