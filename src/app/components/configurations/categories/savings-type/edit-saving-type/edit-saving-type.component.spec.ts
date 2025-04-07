import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSavingTypeComponent } from './edit-saving-type.component';

describe('EditSavingTypeComponent', () => {
  let component: EditSavingTypeComponent;
  let fixture: ComponentFixture<EditSavingTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditSavingTypeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditSavingTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
