import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllByeLawsComponent } from './all-bye-laws.component';

describe('AllByeLawsComponent', () => {
  let component: AllByeLawsComponent;
  let fixture: ComponentFixture<AllByeLawsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllByeLawsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllByeLawsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
