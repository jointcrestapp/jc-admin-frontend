import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AddCurrencyComponent } from "./add-subscription.component";

describe("AddCurrencyComponent", () => {
  let component: AddCurrencyComponent;
  let fixture: ComponentFixture<AddCurrencyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCurrencyComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddCurrencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
