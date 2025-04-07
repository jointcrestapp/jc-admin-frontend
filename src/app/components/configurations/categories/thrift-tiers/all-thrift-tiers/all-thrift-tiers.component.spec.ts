import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllThriftTiersComponent } from './all-thrift-tiers.component';

describe('AllThriftTiersComponent', () => {
  let component: AllThriftTiersComponent;
  let fixture: ComponentFixture<AllThriftTiersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllThriftTiersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllThriftTiersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
