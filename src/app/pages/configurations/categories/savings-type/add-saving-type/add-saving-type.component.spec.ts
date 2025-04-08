import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSavingTypeComponent } from './add-saving-type.component';

describe('AddSavingTypeComponent', () => {
  let component: AddSavingTypeComponent;
  let fixture: ComponentFixture<AddSavingTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSavingTypeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSavingTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
