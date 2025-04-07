import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddShareTypeComponent } from './add-share-type.component';

describe('AddShareTypeComponent', () => {
  let component: AddShareTypeComponent;
  let fixture: ComponentFixture<AddShareTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddShareTypeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddShareTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
