import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddThriftComponent } from './add-thrift.component';

describe('AddMemberComponent', () => {
  let component: AddThriftComponent;
  let fixture: ComponentFixture<AddThriftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddThriftComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddThriftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
