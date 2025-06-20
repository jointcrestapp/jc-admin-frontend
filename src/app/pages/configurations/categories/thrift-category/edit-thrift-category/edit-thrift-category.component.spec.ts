import { ComponentFixture, TestBed } from "@angular/core/testing";

import { EditThriftCategoryComponent } from "./edit-thrift-category.component";

describe("EditThriftCategoryComponent", () => {
  let component: EditThriftCategoryComponent;
  let fixture: ComponentFixture<EditThriftCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditThriftCategoryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditThriftCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
