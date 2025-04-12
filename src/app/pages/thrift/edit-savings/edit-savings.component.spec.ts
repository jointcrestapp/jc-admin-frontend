import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSavingsComponent } from './edit-savings.component';

describe('EditSavingsComponent', () => {
  let component: EditSavingsComponent;
  let fixture: ComponentFixture<EditSavingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditSavingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditSavingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
