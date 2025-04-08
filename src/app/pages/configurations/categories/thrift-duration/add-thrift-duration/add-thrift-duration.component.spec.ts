import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddThriftDurationComponent } from './add-thrift-duration.component';

describe('AddThriftDurationComponent', () => {
  let component: AddThriftDurationComponent;
  let fixture: ComponentFixture<AddThriftDurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddThriftDurationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddThriftDurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
