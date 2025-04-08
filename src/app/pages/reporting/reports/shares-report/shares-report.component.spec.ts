import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharesReportComponent } from './shares-report.component';

describe('SharesReportComponent', () => {
  let component: SharesReportComponent;
  let fixture: ComponentFixture<SharesReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharesReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SharesReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
