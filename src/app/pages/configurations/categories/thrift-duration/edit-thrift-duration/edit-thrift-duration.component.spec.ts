import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditThriftDurationComponent } from './edit-thrift-duration.component';

describe('EditThriftDurationComponent', () => {
  let component: EditThriftDurationComponent;
  let fixture: ComponentFixture<EditThriftDurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditThriftDurationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditThriftDurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
