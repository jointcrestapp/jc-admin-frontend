import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMinuteComponent } from './edit-minute.component';

describe('EditMinuteComponent', () => {
  let component: EditMinuteComponent;
  let fixture: ComponentFixture<EditMinuteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditMinuteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditMinuteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
