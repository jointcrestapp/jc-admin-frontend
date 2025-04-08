import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditByeLawComponent } from './edit-bye-law.component';

describe('EditByeLawComponent', () => {
  let component: EditByeLawComponent;
  let fixture: ComponentFixture<EditByeLawComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditByeLawComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditByeLawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
