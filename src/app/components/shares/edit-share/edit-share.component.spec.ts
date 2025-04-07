import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditShareComponent } from './edit-share.component';

describe('EditShareComponent', () => {
  let component: EditShareComponent;
  let fixture: ComponentFixture<EditShareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditShareComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditShareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
