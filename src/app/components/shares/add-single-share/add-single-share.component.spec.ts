import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSingleShareComponent } from './add-single-share.component';

describe('AddSingleShareComponent', () => {
  let component: AddSingleShareComponent;
  let fixture: ComponentFixture<AddSingleShareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSingleShareComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSingleShareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
