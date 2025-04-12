import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AditMinuteComponent } from './adit-minute.component';

describe('AditMinuteComponent', () => {
  let component: AditMinuteComponent;
  let fixture: ComponentFixture<AditMinuteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AditMinuteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AditMinuteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
