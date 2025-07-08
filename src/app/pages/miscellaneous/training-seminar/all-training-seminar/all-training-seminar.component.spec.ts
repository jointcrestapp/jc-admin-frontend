import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AllMinutesComponent } from "./all-training-seminar.component";

describe("AllMinutesComponent", () => {
  let component: AllMinutesComponent;
  let fixture: ComponentFixture<AllMinutesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllMinutesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AllMinutesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
