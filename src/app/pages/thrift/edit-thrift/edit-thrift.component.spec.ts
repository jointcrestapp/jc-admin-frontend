import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditThriftComponent } from './edit-thrift.component';

describe('AddMemberComponent', () => {
  let component: EditThriftComponent;
  let fixture: ComponentFixture<EditThriftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditThriftComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditThriftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
