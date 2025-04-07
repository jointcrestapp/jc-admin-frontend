import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketHubComponent } from './market-hub.component';

describe('MarketHubComponent', () => {
  let component: MarketHubComponent;
  let fixture: ComponentFixture<MarketHubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarketHubComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarketHubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
