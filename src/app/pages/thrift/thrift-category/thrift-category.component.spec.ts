import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSingleSavingsComponent } from './thrift-category.component';

describe('AddSingleSavingsComponent', () => {
  let component: AddSingleSavingsComponent;
  let fixture: ComponentFixture<AddSingleSavingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSingleSavingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSingleSavingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
