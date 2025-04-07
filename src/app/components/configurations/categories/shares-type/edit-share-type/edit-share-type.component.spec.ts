import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditShareTypeComponent } from './edit-share-type.component';

describe('EditShareTypeComponent', () => {
  let component: EditShareTypeComponent;
  let fixture: ComponentFixture<EditShareTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditShareTypeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditShareTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
