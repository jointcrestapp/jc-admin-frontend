import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMinuteComponent } from './add-minute.component';

describe('AddMinuteComponent', () => {
  let component: AddMinuteComponent;
  let fixture: ComponentFixture<AddMinuteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddMinuteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddMinuteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
