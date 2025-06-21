import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AllThriftCategoryComponent } from "./all-thrift-category.component";

describe("AllThriftCategoryComponent", () => {
  let component: AllThriftCategoryComponent;
  let fixture: ComponentFixture<AllThriftCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllThriftCategoryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AllThriftCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
