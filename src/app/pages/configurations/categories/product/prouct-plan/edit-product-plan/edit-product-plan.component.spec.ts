import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProductPlanComponent } from './edit-product-plan.component';

describe('EditProductPlanComponent', () => {
  let component: EditProductPlanComponent;
  let fixture: ComponentFixture<EditProductPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditProductPlanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditProductPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
