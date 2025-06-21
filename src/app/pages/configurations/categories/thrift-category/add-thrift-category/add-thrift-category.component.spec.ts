import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AddThriftCategoryComponent } from "./add-thrift-category.component";

describe("AddThriftCategoryComponent", () => {
  let component: AddThriftCategoryComponent;
  let fixture: ComponentFixture<AddThriftCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddThriftCategoryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddThriftCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
