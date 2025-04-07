import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProductPlanComponent } from './add-product-plan.component';

describe('AddProductPlanComponent', () => {
  let component: AddProductPlanComponent;
  let fixture: ComponentFixture<AddProductPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddProductPlanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddProductPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
