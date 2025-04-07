import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddByeLawComponent } from './add-bye-law.component';

describe('AddByeLawComponent', () => {
  let component: AddByeLawComponent;
  let fixture: ComponentFixture<AddByeLawComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddByeLawComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddByeLawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
