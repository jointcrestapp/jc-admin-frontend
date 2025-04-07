import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllProductPlansComponent } from './all-product-plans.component';

describe('AllProductPlansComponent', () => {
  let component: AllProductPlansComponent;
  let fixture: ComponentFixture<AllProductPlansComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllProductPlansComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllProductPlansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
