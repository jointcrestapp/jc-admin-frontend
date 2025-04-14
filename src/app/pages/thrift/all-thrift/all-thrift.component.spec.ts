import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllSavingsComponent } from './all-thrift.component';

describe('AllSavingsComponent', () => {
  let component: AllSavingsComponent;
  let fixture: ComponentFixture<AllSavingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllSavingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllSavingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
