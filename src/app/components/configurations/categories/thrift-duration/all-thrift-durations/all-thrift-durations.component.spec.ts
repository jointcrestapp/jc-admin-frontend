import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllThriftDurationsComponent } from './all-thrift-durations.component';

describe('AllThriftDurationsComponent', () => {
  let component: AllThriftDurationsComponent;
  let fixture: ComponentFixture<AllThriftDurationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllThriftDurationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllThriftDurationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
